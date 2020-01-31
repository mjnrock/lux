import WS from "ws";

import Node from "./../Node";
import Packet from "./Packet";

export default class WebSocket extends Node {
    constructor(host, port, isSSL = false) {
        super();
        
        this.meta("Host", host);
        this.meta("Port", port);
        this.meta("Protocol", isSSL ? `wss:` : `ws:`);
        this.meta("Connection", null);

        this.prop("LastResponse", null);

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

    GetLastResponse() {
        return this.prop("LastResponse");
    }

    GetUrl() {
        let host = `${ this.meta("Host") }:${ this.meta("Port") }`,
            url = `${ this.meta("Protocol")  }//${ host }/`;

        return url;
    }

    Connect() {
        if(this.metaIsEmpty("Connection")) {
            this.meta("Connection", new WS(this.GetUrl()));

            this.meta("Connection").on("open", () => this.emit("open"));
            this.meta("Connection").on("message", (msg) => {
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

                    this.prop("LastResponse", packet);

                    this.emit("packet", packet);   // Special case of "onmessage" to conform to Lux <Node>
                } else {
                    this.prop("LastResponse", msg);

                    this.emit("message", msg);
                }
            });
            this.meta("Connection").on("close", () => this.emit("close"));

            this.emit("connect");
        }

        return this;
    }
    Destroy() {
        if(!this.metaIsEmpty("Connection")) {
            this.meta("Connection").terminate();

            this.emit("destroy");
        }

        return this;
    }

    Send(payload) {
        let data = payload;
        
        if(typeof payload === "object" || Array.isArray(payload))  {
            data = JSON.stringify(payload);
        }

        let packet = new Packet(this.UUID(), null, data);
        this.meta("Connection").send(packet);
        // this.meta("Connection").send(packet.toJSON());

        return this;
    }
};