import Attribute from "./Attribute";

export default class NumberAttribute extends Attribute {
    constructor(value = 0, { min = null, max = null, name = null } = {}) {
        super(value);

        this.prop("name", name);
        this.prop("min", min);
        this.prop("max", max);

        this.addEvent(
            "prop-change::unsafe-integer",
            "prop-change::zero",
            "prop-change::min",
            "prop-change::max"
        );
    }

    init(value = 0, min = null, max = null) {
        this.Min(min);
        this.Max(max);

        this.Value(value);
        
        return this;
    }

    Name(name) {
        if(name === void 0) {
            return this.prop("name");
        }

        return this.prop("name", name);
    }

    //  The clamping is mediated by this.Change()
    Value(value) {
        if(value === void 0) {
            return this.prop("value");
        }

        return this.change(value, this.prop("value"));
    }
    Min(min) {
        if(min === void 0) {
            return this.prop("min");
        }

        return this.prop("min", min);
    }
    Max(max) {
        if(max === void 0) {
            return this.prop("max");
        }

        return this.prop("max", max);
    }
    Range(min, max) {
        if(min === void 0 && max === void 0) {
            return [ this.Min(), this.Max() ];
        }

        this.Min(min);
        this.Max(max);
        
        return this;
    }

    toFixed(precision = 2) {
        return this.Value().toFixed(precision);
    }

    add(...values) {
        let val = this.Value();
        for(let value of values) {
            if(value instanceof NumberAttribute) {
                val += value.Value();
            } else {
                val += value;
            }
        }

        return this.Value(val);
    }
    subtract(...values) {
        let val = this.Value();
        for(let value of values) {
            if(value instanceof NumberAttribute) {
                val -= value.Value();
            } else {
                val -= value;
            }
        }

        return this.Value(val);
    }
    multiply(...values) {
        let val = this.Value();
        for(let value of values) {
            if(value instanceof NumberAttribute) {
                val *= value.Value();
            } else {
                val *= value;
            }
        }

        return this.Value(val);
    }
    divide(...values) {
        let val = this.Value();
        for(let value of values) {
            if(value instanceof NumberAttribute) {
                val = val / value.Value();
            } else {
                val = val / value;
            }
        }

        return this.Value(val);
    }

    toPercent(asText = false) {
        if(asText) {
            return `${ this.ToRate() * 100 }%`;
        }

        return this.ToRate() * 100;
    }
    toRate() {
        let value = this.Value(),
            min = this.prop("min"),
            max = this.prop("max");

        if((min === null || min === void 0) || (max === null || max === void 0)) {
            return false;
        }

        return (value - min) / (max - min);
    }
    
    isMin() {
        return this.prop("value") === this.prop("min");
    }
    isMax() {
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
        if(!Number.isSafeInteger(newValue)) {
            this.emit("prop-change::unsafe-integer", `${ newValue }`, oldValue);
        }

        if(typeof newValue !== "number") {
            newValue = Number(newValue);
        }

        let min = this.Min(),
            max = this.Max();
           
        //  min clamp, on min
        if((min !== null && min !== void 0) && newValue <= min) {
            newValue = min;

            this.emit("prop-change::min", newValue, oldValue);
        }
        //  max clamp, on max
        if((max !== null && max !== void 0) && newValue >= max) {
            newValue = max;
            
            this.emit("prop-change::max", newValue, oldValue);
        }
        //  on zero
        if(newValue === 0) {
            this.emit("prop-change::zero", newValue, oldValue);
        }

        this.prop("value", newValue);

        return this;
    }
};