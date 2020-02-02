import React, { Component } from "react";
import Context from "./Context";

class ReactorComponent extends Component {
    constructor(props) {
        super(props);

        this.$ = this.context.getSubState;

        this.watch("substate-change", e => this.forceUpdate());
    }
};

ReactorComponent.contextType = Context;

export default ReactorComponent;