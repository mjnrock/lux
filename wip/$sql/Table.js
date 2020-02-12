import Column from "./Column";

export default class Table {
    constructor(name) {
        this._name = name;
        this._columns = {};
    }

    getName() {
        return this._name;
    }
    getColumn(name) {
        return this._columns[ name ];
    }

    getColumns() {
        return this._columns;
    }

    addColumn(column) {
        if(column instanceof Column) {
            this._columns[ column.getName() ] = column;
        }

        return this;
    }

    toObject() {
        let columns = {};
        for(let [ key, value ] of Object.entries(this._columns)) {
            columns[ key ] = value.toObject();
        }

        return {
            _name: this._name,
            _columns: columns
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