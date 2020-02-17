let RegEx = {
    DECIMAL: new RegExp("^[-]?(0[,.]|[1-9][0-9]*[,.])\d+$"),
    INTEGER: new RegExp("^(0|[-]?[1-9][0-9]*)$"),
};

// Compound Regular Expressions
RegEx.NUMBER = new RegExp(`(${ RegEx.DECIMAL.source }|${ RegEx.INTEGER.source }){1}`)       // XOR-like behavior

export default Object.freeze(RegEx);