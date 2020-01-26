import WS from "ws";

import Node from "./../Node";
import Packet from "./Packet";

export default class WebSocket extends Node {
    constructor(host, port, isSSL = false) {
        super();
        
        this.prop("Host", host);
        this.prop("Port", port);
        this.prop("Protocol", isSSL ? `wss:` : `ws:`);
        this.prop("WebSocket", null);

        this.addEvent(
            "connect",
            "destroy",
            "open",
            "message",
            "close"
        );

        this._registerModule("data-connector");
    }

    getUrl() {
        let host = `${ this.prop("Host") }:${ this.prop("Port") }`,
            url = `${ this.prop("Protocol")  }//${ host }/`;

        return url;
    }

    Connect() {
        if(this.propIsEmpty("WSS")) {
            this.prop("WSS", new WS(this.getUrl()));

            this.prop("WSS").on("open", () => this.emit("open"));
            this.prop("WSS").on("message", (msg) => this.emit("message", msg));
            this.prop("WSS").on("close", () => this.emit("close"));

            this.emit("connect");
        }

        return this;
    }
    Destroy() {
        if(!this.propIsEmpty("WSS")) {
            this.prop("WSS").terminate();

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
        this.prop("WSS").send(packet);
        // this.prop("WSS").send(packet.toJSON());

        return this;
    }
};