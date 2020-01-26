//? [ Function, Expected this.args.length, Supported types ]
const ConditionType = {
    EQUALS: [ "Equals", 1, [ "string", "number", "boolean" ] ],
    NOT_EQUALS: [ "NotEquals", 1, [ "string", "number", "boolean" ] ],
    BETWEEN: [ "Between", 2, [ "number" ] ],
    IN: [ "In", null, [ "any" ] ],
    NOT_IN: [ "NotIn", null, [ "any" ] ],
    GT: [ "GT", 1, [ "number" ] ],
    GTE: [ "GTE", 1, [ "number" ] ],
    LT: [ "LT", 1, [ "number" ] ],
    LTE: [ "LTE", 1, [ "number" ] ],
    CONTAINS: [ "Contains", 1, [ "any" ] ],
    NOT_CONTAINS: [ "NotContains", 1, [ "any" ] ],
    MATCH: [ "Match", 1, [ "string", "number", "boolean" ] ],
    UUID: [ "UUID", 1, [ "string" ] ],
};

export default ConditionType;