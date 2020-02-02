import React, { Component } from "react";
import Context from "./Context";

class ReactorComponent extends Component {
    // static contextType = Context;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let _this = this;
        this.context.listen("substate-change", e => _this.forceUpdate());
    }

    $(name) {
        return this.context.$(name) || {};
    }
};

ReactorComponent.contextType = Context;

export default ReactorComponent;