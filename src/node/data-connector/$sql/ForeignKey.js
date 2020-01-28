export default class ForeignKey {
    /**
     * @param {Column} column The "left side" column
     * @param {Column} referent The "right side" column
     * @param {Table} table The "right side" table
     */
    constructor(column, referent, table) {
        this._column = column;

        this._referent = referent;
        this._table = table;
    }

    getColumn() {
        return this._column;
    }

    getReferent() {
        return this._referent;
    }
    getTable() {
        return this._table;
    }

    toObject() {
        return {
            _column: this._column.toObject(),

            _referent: this._referent.toObject(),
            _table: this._table.toObject()
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

        if(!(obj._column && obj._referent && obj._table)) {
            return false;
        }

        return new Column(
            obj._column,
            obj._referent,
            obj._table
        );
    }
};