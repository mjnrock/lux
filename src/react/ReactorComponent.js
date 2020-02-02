import React, { Component } from "react";
import Context from "./Context";

class ReactorComponent extends Component {
    // static contextType = Context;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.$ = this.context.getSubState;

        this.context.watch("substate-change", e => this.forceUpdate());
    }
};

ReactorComponent.contextType = Context;

export default ReactorComponent;