import Node from "./../Node";

export default class Attribute extends Node {
    constructor(value) {
        super();
        
        this.prop("value", value);

        this._registerModule("logic");
    }

    Value(input) {
        if(input === null || input === void 0) {
            return this.prop("value");
        }

        if(typeof input === "function") {
            return this.prop("value", input(this.prop("value"), this));
        }

        return this.prop("value", input);
    }
};