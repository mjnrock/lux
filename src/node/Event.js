export default class Event {
    constructor(type, payload, emitter) {
        this._type = type;
        this._payload = payload;
        this._emitters = [
            emitter
        ];
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