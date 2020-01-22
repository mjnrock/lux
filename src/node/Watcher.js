import { GenerateUUID } from "../core/helper";

export default class Watcher {
    constructor(prop, callback) {
        this._uuid = GenerateUUID();
        this._prop = prop;
        this._callback = callback;

        if(prop === null || prop === void 0) {
            throw new Error("[Invalid Prop]: Prop cannot be empty");
        }
        if(typeof callback !== "function") {
            throw new Error("[Invalid Callback]: Callback must be a function");
        }

        return Object.freeze(this);
    }

    UUID() {
        return this._uuid;
    }

    getProp() {
        return this._prop;
    }

    getCallback() {
        return this._callback;
    }
    runCallback(...args) {
        return this._callback(...args);
    }
};