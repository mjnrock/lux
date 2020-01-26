import { Clamp } from "./helper";
import Attribute from "./Attribute";

export default class NumberAttribute extends Attribute {
    constructor(value = 0, min = null, max = null) {
        super(value);

        this.prop("min", min);
        this.prop("max", max);

        this.on("prop-change::zero");
        this.on("prop-change::min");
        this.on("prop-change::max");
    }

    init(value = 0, min = null, max = null) {
        this.Value(value);
        this.setMin(min);
        this.setMax(max);
        
        return this;
    }

    //  The clamping is mediated by this.change()
    Value(value) {
        if(value === null || value === void 0) {
            return this.prop("value");
        }

        return this.change(value, this.prop("value"));
    }
    Min(min) {
        if(min === null || min === void 0) {
            return this.prop("min");
        }

        return this.prop("min", min);
    }
    Max(max) {
        if(max === null || max === void 0) {
            return this.prop("max");
        }

        return this.prop("max", max);
    }
    Range(min, max) {
        this.Min(min);
        this.Max(max);
        
        return this;
    }

    add(value) {
        return this.Value(this.Value() + value);
    }
    subtract(value) {
        return this.Value(this.Value() - value);
    }
    multiply(value) {
        return this.Value(this.Value() * value);
    }
    divide(value) {
        return this.Value(this.Value() / value);
    }

    toPercent() {
        return this.toRate() * 100;
    }
    toRate() {
        let value = this.Value(),
            min = this.prop("min"),
            max = this.prop("max");

        return (value - min) / (max - min);
    }
    
    isEmpty() {
        return this.prop("value") === this.prop("min");
    }
    isFull() {
        return this.prop("value") === this.prop("max");
    }

    inc(value = 1) {
        let oldValue = this.Value(),
            newValue = oldValue + value;

        return this.change(newValue, oldValue);
    }
    dec(value = 1) {
        let oldValue = this.Value(),
            newValue = oldValue - value;            

        return this.change(newValue, oldValue);
    }

    change(newValue, oldValue) {
        let min = this.Min(),
            max = this.Max();
           
        //  min clamp, on min
        if((min !== null && min !== void 0) && newValue <= min) {
            newValue = min;

            this.call("prop-change::min", newValue, oldValue);
        }
        //  max clamp, on max
        if((max !== null && max !== void 0) && newValue >= max) {
            newValue = max;
            
            this.call("prop-change::max", newValue, oldValue);
        }
        //  on zero
        if(newValue === 0) {
            this.call("prop-change::zero", newValue, oldValue);
        }

        this.prop("value", newValue);

        return this;
    }
};