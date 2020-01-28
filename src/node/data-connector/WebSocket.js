import WS from "ws";

import Node from "./../Node";
import Packet from "./Packet";

export default class WebSocket extends Node {
    constructor(host, port, isSSL = false) {
        super();
        
        this.prop("Host", host);
        this.prop("Port", port);
        this.prop("Protocol", isSSL ? `wss:` : `ws:`);
        this.prop("Connection", null);

        this.addEvent(
            "connect",
            "destroy",
            "open",
            "message",
            "packet",
            "close"
        );

        this._registerModule("data-connector");
    }

    getUrl() {
        let host = `${ this.prop("Host") }:${ this.prop("Port") }`,
            url = `${ this.prop("Protocol")  }//${ host }/`;

        return url;
    }

    connect() {
        if(this.propIsEmpty("Connection")) {
            this.prop("Connection", new WS(this.getUrl()));

            this.prop("Connection").on("open", () => this.emit("open"));
            this.prop("Connection").on("message", (msg) => {
                let obj = msg;
                
                try {
                    while(typeof obj === "string" || obj instanceof String) {
                        obj = JSON.parse(obj);
                    }
                } catch (e) {
                    if(typeof msg === "string" || msg instanceof String) {
                        obj = msg;
                    }
                }

                if(msg._type && msg._type === "data-connector.packet") {
                    let packet = Packet.fromJSON(msg);

                    this.emit("packet", packet);   // Special case of "onmessage" to conform to Lux <Node>
                } else {
                    this.emit("message", msg);
                }
            });
            this.prop("Connection").on("close", () => this.emit("close"));

            this.emit("connect");
        }

        return this;
    }
    destroy() {
        if(!this.propIsEmpty("Connection")) {
            this.prop("Connection").terminate();

            this.emit("destroy");
        }

        return this;
    }

    send(payload) {
        let data = payload;
        
        if(typeof payload === "object" || Array.isArray(payload))  {
            data = JSON.stringify(payload);
        }

        let packet = new Packet(this.UUID(), null, data);
        this.prop("Connection").send(packet);
        // this.prop("Connection").send(packet.toJSON());

        return this;
    }
};