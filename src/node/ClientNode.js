import DataConnector from "./data-connector/package";
import MasterNode from "./MasterNode";
import Packet from "./data-connector/Packet";

export default class ClientNode extends MasterNode {
    constructor({ api = {}, ws = {} } = {}) {
        if(Object.entries(api).length === 0 && api.constructor === Object) {
            this.load("WebAPI", new DataConnector.WebAPI(
                api.host,
                api.port || 80,
                api.isSSL || false
            ));
        }
        if(Object.entries(ws).length === 0 && ws.constructor === Object) {
            this.load("WebSocket", new DataConnector.WebSocket(
                api.host,
                api.port || 80,
                api.isSSL || false
            ));
        }

        this.flagOnIsReactionary();

        this.prop("Messages", {});
        this.eventReaction(
            "ws-message",
            "message",
            e => {
                return this.enqueue(e.getPayload(), this.getNodeName(e.getEmitter()))
            }
        );
        this.eventReaction(
            "ws-packet",
            "packet",
            e => {
                return this.enqueue(e.getPayload(), this.getNodeName(e.getEmitter()))
            }
        );
        this.eventReaction(
            "api-json",
            "json",
            e => {
                return this.receiveJson(e.getPayload(), this.getNodeName(e.getEmitter()))
            }
        );

        this.addEvent(
            "enqueue",
            "dequeue",
            "flush"
        );

        this._registerModule("client");
    }

    receiveJson(json, name = "WebAPI") {
        let obj = json;

        try {
            while(typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }
            
            this.processSubStateChange(name, obj);
        } catch (e) {
            this.emit("error", e);
        }
    }

    enqueue(e, name = "WebSocket") {
        let message = e.getPayload();

        if(!Array.isArray(this.oprop("Messages", name))) {
            this.oprop("Messages", name, []);
        }
        let queue = this.oprop("Messages", name);

        queue.push(message);

        this.emit("enqueue", name, queue.length);

        return message;
    }
    dequeue(name = "WebSocket") {
        if(!Array.isArray(this.oprop("Messages", name))) {
            return;
        }
        let queue = this.oprop("Messages", name);

        let message = queue.pop();

        this.emit("dequeue", name, message);
    }
    flush(name = "WebSocket") {
        if(!Array.isArray(this.oprop("Messages", name))) {
            return;
        }
        let queue = this.oprop("Messages", name);
        
        this.oprop("Messages", name, []);
        
        this.emit("flush", queue);

        return queue;
    }

    connect(name = "WebSocket") {
        let WS = this.node(name),
            conn = WS.prop("Connection");

        if(WS && WS instanceof DataConnector.WebSocket && !conn) {
            WS.connect();
        }
    }
    destroy(name = "WebSocket") {
        let WS = this.node(name),
            conn = WS.prop("Connection");

        if(WS && WS instanceof DataConnector.WebSocket && conn) {
            WS.destroy();
        }
    }

    send(packet, name = "WebSocket") {
        let WS = this.node(name),
            conn = WS.prop("Connection");

        if(WS && WS instanceof DataConnector.WebSocket && conn && packet instanceof Packet) {
            conn.send(packet.toJSON());
        }
    }
};