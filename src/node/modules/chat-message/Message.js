import { GenerateUUID } from "./../../../core/helper";

export default class Message {
    constructor(creator, payload, ts = null, uuid = null) {
        this._uuid = uuid || GenerateUUID();

        this._creator = creator;
        this._payload = payload;
        this._timestamp = ts || Date.now();

        return Object.freeze(this);
    }

    UUID() {
        return this._uuid;
    }

    getCreator() {
        return this._creator;
    }
    getPayload() {
        return this._payload;
    }
    getTimestamp() {
        return this._timestamp;
    }

    static fromJSON(json) {
        let obj = json;

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(obj);
        }

        let msg = new Message(
            obj._creator,
            obj._payload,
            obj._timestamp,
            obj._uuid
        );

        return msg;
    }
}