import React, { Component } from "react";
import Context from "./Context";

class ObserverComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(!this.context.getReactions("change")) {
            this.context.addReaction("change", this.forceUpdate.bind(this));
        }
    }
};

ObserverComponent.contextType = Context.ObserverContext;

export default ObserverComponent;