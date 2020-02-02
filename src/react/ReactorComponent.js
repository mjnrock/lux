import React, { Component } from "react";
import Context from "./Context";

export default class ReactorComponent extends Component {
    static contextType = Context;

    constructor(props) {
        super(props);

        this.$ = this.context.getSubState;

        this.watch("substate-change", e => this.forceUpdate());
    }
};