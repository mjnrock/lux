import { GenerateUUID } from "./../core/helper";

export default class Listener {
    constructor(callback) {
        this._uuid = GenerateUUID();
        this._callback = callback;

        if(typeof callback !== "function") {
            throw new Error("[Invalid Callback]: Callback must be a function");
        }

        return Object.freeze(this);
    }

    UUID() {
        return this._uuid;
    }

    getCallback() {
        return this._callback;
    }
    runCallback(event) {
        
        return this._callback(event);
    }
};