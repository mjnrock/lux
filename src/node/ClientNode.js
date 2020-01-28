import DataConnector from "./data-connector/package";
import MasterNode from "./MasterNode";
import Packet from "./data-connector/Packet";

export default class ClientNode extends MasterNode {
    constructor({ api = {}, ws = {} } = {}) {
        if(Object.entries(api).length === 0 && api.constructor === Object) {
            this.loadWebAPI("WebAPI", api.host, api.port, api.iSSL);
        }
        if(Object.entries(ws).length === 0 && ws.constructor === Object) {
            this.loadWebSocket("WebSocket", ws.host, ws.port, ws.iSSL);
        }

        this.flagOnIsReactionary();

        this.prop("Messages", {});

        let eventExtractor = (e, fn) => fn(e.getPayload(), this.getNodeName(e.getEmitter()));
        this.eventReaction("message", e => eventExtractor(e, this.enqueue));
        this.eventReaction("packet", e => eventExtractor(e, this.enqueue));
        this.eventReaction("json", e => eventExtractor(e, this.receiveJson));

        this.addEvent(
            "enqueue",
            "dequeue",
            "flush"
        );

        this._registerModule("client");
    }

    loadWebAPI(name, { host, port = 80, isSSL = false, node = null } = {}) {
        this.load(name, node || new DataConnector.WebAPI(
            host,
            port,
            isSSL
        ));
    }
    loadWebSocket(name, { host, port = 80, isSSL = false, node = null } = {}) {
        this.load(name, node || new DataConnector.WebSocket(
            host,
            port,
            isSSL
        ));
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

    async fetch(endpoint, params = {}, { name = "WebAPI", reducer = null } = {}) {
        let webApi = this.getSubordinate(name);

        if(webApi) {
            let data = await webApi.JSON(endpoint, params);

            if(typeof reducer === "function") {
                data = reducer(reducer);
            }
            
            this.processSubStateChange(name, data);
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