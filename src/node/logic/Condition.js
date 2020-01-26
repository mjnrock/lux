import Node from "./../Node";
import Attribute from "./Attribute";

class Condition extends Node {
    constructor(type, ...args) {
        super();
        
        //  Use Enum.ConditionType[ ... ] as @type argument
        this.prop("type", type);
        //  Variable amount of arguments, specified by Condition.EnumTypes.[ ... ][ 1 ]
        this.prop("args", args);
        //  The result of the last .Run() or the initial condition
        this.prop("result", false);
        //  Optionally use .Assign() to store an <Attribute> association locally
        this.prop("attribute", null);

        this.addEvent(
            "run"
        );

        this._registerModule("logic");
    }

    IsAssigned() {
        return this.prop("attribute") instanceof Attribute;
    }

    /**
     * @param {Attribute} attribute Assign a local variable to an <Attribute>
     * @param {bool} addChangeListener Invoke this.Run() on this.prop("attribute"):prop-change event
     */
    Assign(attribute, addChangeListener = false) {
        if(attribute instanceof Attribute) {
            this.prop("attribute", attribute);

            if(addChangeListener) {
                this.prop("attribute").listen("prop-change", ([ t, n, o ]) => this.Run(this.prop("attribute")));
            }
        }

        return this;
    }
    Unassign() {
        this.prop("attribute", null);

        return this;
    }

    Run(attribute) {
        if((attribute === void 0 || attribute === null) && (this.prop("attribute") === null || this.prop("attribute") === void 0)) {
            throw new Error(`[Incorrect Condition Setup]: Both @attribute and @this.prop("attribute") are either 'null' or 'undefined'`);
        }

        // eslint-disable-next-line
        let [ name, len, types ] = this.prop("type"),
            fn = this[ name ].bind(this);

        if(typeof fn === "function") {
            if(len === null || (this.prop("args").length === len)) {
                if(this.prop("attribute") instanceof Attribute) {
                    this.prop("result", fn(this.prop("attribute")));
                } else {
                    this.prop("result", fn(attribute));
                }

                if(typeof this.hasEvent("run")) {
                    this.emit("run", this.prop("result"));
                }

                return this.prop("result");
            }
        }

        throw new Error(`[Incorrect Condition Setup]: Please use <Condition.EnumTypes.[ ... ]> as the @type argument.`);
    }

    Equals(attribute) {
        if(attribute instanceof Attribute) {
            let [ var1 ] = this.prop("args"),
                value = attribute.Value();

            if(typeof value === "string" || value instanceof String) {
                return value === var1;
            } else if(typeof value === "number") {
                return value === var1;
            } else if(typeof value === "boolean") {
                return !!value === !!var1;
            }
        }

        return false;
    }
    NotEquals(attribute) {
        return !this.Equals(attribute);
    }

    Between(attribute) {
        if(attribute instanceof Attribute) {
            let [ var1, var2 ] = this.prop("args"),
                value = attribute.Value();

            if(typeof value === "number") {
                return value >= var1 && value <= var2;
            }
        }

        return false;
    }

    In(attribute) {
        if(attribute instanceof Attribute) {
            let value = attribute.Value();

            if(Array.isArray(this.prop("args"))) {
                return this.prop("args").includes(value);
            }
        }

        return false;
    }
    NotIn(attribute) {
        return !this.In(attribute);
    }

    GT(attribute) {
        if(attribute instanceof Attribute) {
            let [ var1 ] = this.prop("args"),
                value = attribute.Value();

            if(typeof value === "number") {
                return value > var1;
            }
        }

        return false;
    }
    GTE(attribute) {
        if(attribute instanceof Attribute) {
            let [ var1 ] = this.prop("args"),
                value = attribute.Value();

            if(typeof value === "number") {
                return value >= var1;
            }
        }

        return false;
    }

    LT(attribute) {
        if(attribute instanceof Attribute) {
            let [ var1 ] = this.prop("args"),
                value = attribute.Value();

            if(typeof value === "number") {
                return value < var1;
            }
        }

        return false;
    }
    LTE(attribute) {
        if(attribute instanceof Attribute) {
            let [ var1 ] = this.prop("args"),
                value = attribute.Value();

            if(typeof value === "number") {
                return value <= var1;
            }
        }

        return false;
    }

    Contains(attribute) {
        if(attribute instanceof Attribute) {
            let [ var1 ] = this.prop("args"),
                value = attribute.Value();

            if(Array.isArray(value)) {
                return value.includes(var1);
            }
        }

        return false;
    }
    NotContains(attribute) {
        return !this.Contains(attribute);
    }

    Match(attribute) {
        if(attribute instanceof Attribute) {
            let regex = RegExp(this.prop("args")[ 0 ]),
                value = attribute.Value();

            return regex.test(value);
        }

        return false;
    }

    UUID(attribute) {
        if(attribute instanceof Attribute && attribute.UUID) {
            let [ var1 ] = this.prop("args"),
                value = attribute.Value();

            return value.UUID() === var1;
        }

        return false;
    }
};

export default Condition;