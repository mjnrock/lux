import ClassDecorators from "./classDecorators";

export default class Attribute extends ClassDecorators.StateEvents {
    constructor(value) {
        super();
        
        this.prop("value", value);

        return this;
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