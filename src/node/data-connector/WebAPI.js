import fetch from "node-fetch";

import Node from "./../Node";

export default class WebAPI extends Node {
    constructor(host, port, isSSL = false) {
        super();

        this.meta("Host", host);
        this.meta("Port", port);
        this.meta("Protocol", isSSL ? `https:` : `http:`);

        this.prop("LastResponse", null);

        this.addEvent(
            "request",
            "json"
        );

        this._registerModule("data-connector");
    }

    getLastResponse() {
        return this.prop("LastResponse");
    }

    getUrl(endpoint, params = {}) {
        let host = `${ this.meta("Host") }:${ this.meta("Port") }`,
            url = `${ this.meta("Protocol")  }//${ host }/${ endpoint.replace(/\/$/, "").replace(/^\/+/g, "") }/`,
            p = Object.entries(params).reduce((a, [ k, v ], i) => {
                if(i > 0) {
                    return `${ a }&${ k }=${ v }`;
                } else {
                    return `?${ k }=${ v }`;
                }
            }, "");

        return `${ url }${ p }`;
    }

    async JSON(endpoint, params = {}) {
        let url = this.getUrl(endpoint, params);
        
        this.emit("request", { endpoint, params, url });
        
        let response = await fetch(url, { method: "GET", mode: "cors", headers: { "Content-Type": "application/json" } }),
            data = await response.json();

        this.prop("LastResponse", data);

        this.emit("json", { endpoint, params, data });

        return data;
    }
};