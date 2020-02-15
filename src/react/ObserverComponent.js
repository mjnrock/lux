import React, { Component } from "react";
import Context from "./Context";

class ObserverComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(!this.context.getReactions("change")) {
            let _this = this;
            this.context.addReaction("change", e => _this.forceUpdate());
        }
    }
};

ObserverComponent.contextType = Context.ObserverContext;

export default ObserverComponent;