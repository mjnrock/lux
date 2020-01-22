import { GenerateUUID } from "./../core/helper";

export default class Listener {
    constructor(event, callback) {
        this._uuid = GenerateUUID();
        this._event = event;
        this._callback = callback;

        if(event === null || event === void 0) {
            throw new Error("[Invalid Event]: Event cannot be empty");
        }
        if(typeof callback !== "function") {
            throw new Error("[Invalid Callback]: Callback must be a function");
        }

        return Object.freeze(this);
    }

    UUID() {
        return this._uuid;
    }

    getEvent() {
        return this._event;
    }

    getCallback() {
        return this._callback;
    }
    runCallback(event) {

        return this._callback(event);
    }
};