import fetch from "node-fetch";

import Node from "./../Node";

export default class WebAPI extends Node {
    constructor(host, port, isSSL = false) {
        super();

        this.prop("Host", host);
        this.prop("Port", port);
        this.prop("Protocol", isSSL ? `https:` : `http:`);
        this.prop("WebSocket", null);

        this.addEvent(
            "request",
            "json"
        );

        this._registerModule("connector.webapi");
    }

    getUrl(endpoint, params = {}) {
        let host = `${ this.prop("Host") }:${ this.prop("Port") }`,
            url = `${ this.prop("Protocol")  }//${ host }/${ endpoint.replace(/\/$/, "").replace(/^\/+/g, "") }/`,
            p = Object.entries(params).reduce((a, [ k, v ], i) => {
                if(i > 0) {
                    return `${ a }&${ k }=${ v }`;
                } else {
                    return `?${ k }=${ v }`;
                }
            }, "");

        return `${ url }${ p }`;
    }

    async GetJson(endpoint, params = {}) {
        let url = this.getUrl(endpoint, params);
        
        this.emit("request", { endpoint, params, url });
        
        let response = await fetch(url, { method: "GET", mode: "cors", headers: { "Content-Type": "application/json" } }),
            data = await response.json();

        this.emit("json", { endpoint, params, data });

        return data;
    }
};