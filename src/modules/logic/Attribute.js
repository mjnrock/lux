import Node from "./../../node/Node";

export default class Attribute extends Node {
    constructor(value) {
        super();
        
        this.prop("value", value);

        this._registerModule("logic");
    }

    Value(input) {
        if(input === void 0) {
            return this.prop("value");
        }

        return this.prop("value", input);
    }
};