import React, { Component } from "react";
import Context from "./Context";

class ReactorComponent extends Component {
    // static contextType = Context;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.context.watch("substate-change", this.forceUpdate);
    }

    $(name) {
        return this.context.getSubState(name);
    }
};

ReactorComponent.contextType = Context;

export default ReactorComponent;