import React, { Component } from "react";
import Context from "./Context";
import Node from "./../node/Node";

class ReactorComponent extends Component {
    // static contextType = Context;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let _this = this;
        this.context.listen("substate-change", e => _this.forceUpdate());
    }

    e(name) {
        return this.context.getEntity(name);
    }
    ep(name, prop, value) {
        let ent = this.e(name);

        if(ent instanceof Node) {
            return ent.prop(prop, value);
        }
    }
    eop(name, prop, key, value) {
        let ent = this.e(name);

        if(ent instanceof Node) {
            return ent.prop(prop, key, value);
        }
    }
    eap(name, prop, index, value) {
        let ent = this.e(name);

        if(ent instanceof Node) {
            return ent.prop(prop, index, value);
        }
    }
    $(name) {
        let ent = this.e(name);

        if(ent instanceof Node) {
            return ent.getState();
        }
    }
    $$(name) {
        return this.context.getSubState(name);
    }
};

ReactorComponent.contextType = Context.NodeContext;

export default ReactorComponent;