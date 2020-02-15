import React, { Component } from "react";
import Context from "./Context";

class ObserverComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.context.setReaction("change", this.forceUpdate.bind(this));
    }
};

ObserverComponent.contextType = Context.ObserverContext;

export default ObserverComponent;