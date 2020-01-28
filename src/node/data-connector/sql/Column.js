import ForeignKey from "./ForeignKey";

export default class Column {
    constructor(name, type, { label = null, validator = null, reference = null } = {}) {
        this._name = name;
        this._type = type;
        this._label = label ? label : name;

        this._validator = validator;

        this._reference = reference instanceof ForeignKey ? reference : null;
    }

    getName() {
        return this._name;
    }
    getType() {
        return this._type;
    }
    getLabel() {
        return this._label;
    }
    
    getValidator() {
        return this._validator;
    }

    getReference() {
        return this._reference;
    }    
    setReference(foreignKey) {
        if(foreignKey instanceof ForeignKey) {
            this._reference = foreignKey;
        }

        return this;
    }

    validate(...args) {
        if(typeof this._validator === "function") {
            return this._validator(...args);
        }

        return false;
    }

    toObject() {
        return {
            _name: this._name,
            _type: this._type,
            _label: this._label,

            _validator: this._validator,
            _reference: this._reference instanceof ForeignKey ? this._reference.toObject() : null
        };
    }
    
    serialize() {
        return JSON.stringify(this.toObject());
    }
    static deserialize(json) {
        let obj = json;

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(json);
        }

        if(!(obj._name && obj._type)) {
            return false;
        }

        return new Column(
            obj._name,
            obj._type,
            {
                label: obj._label || obj._name,
                validator: obj._validator,
                reference: obj._reference
            }
        );
    }
};