import Attribute from "./Attribute";

export default class FunctionAttribute extends Attribute {
    constructor(fn, { name = null } = {}) {
        super(fn);

        this.prop("name", name);

        return this;
    }

    Name(name) {
        if(name === void 0) {
            return this.prop("name");
        }

        return this.prop("name", name);
    }

    exec(...args) {
        if(typeof this.Value() === "function") {
            let fn = this.Value();

            return fn(...args);
        }
    }
};