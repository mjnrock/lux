import { GenerateUUID } from "./../core/helper";

export default class Event {
    constructor(type, payload, emitter = null) {
        this._uuid = GenerateUUID();
        this._type = type;
        this._payload = payload;

        // This is intentionally not safe, as is meant for tracking emitters in an otherwise-secured scope
        this._emitters = emitter ? [
            emitter
        ] : [];

        return Object.freeze(this);
    }

    UUID() {
        return this._uuid;
    }

    getType() {
        return this._type;
    }
    isType(type) {
        return this._type === type;
    }

    getPayload() {
        return this._payload;
    }

    getEmitter(index = 0) {
        return this._emitters[ index ];
    }
    addEmitter(emitter) {
        this._emitters.push(emitter);

        return this;
    }
    
    getEmitters() {
        return this._emitters;
    }
};