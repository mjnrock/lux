import React, { Component } from "react";
import Lux from "@lespantsfancy/lux";

export default class Provider extends Component {
    constructor(props) {
        super(props);
        
        this.state = new Lux.Core.ClassDecorators.StateEvents();
        this.state.prop("Lux", this.props.lux);
        this.state.watch("Lux", () => this.forceUpdate());
    }
    
    render() {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { Lux: this.state, store: this.state.prop("Lux") })
        );

        return (
            <div>{ childrenWithProps }</div>
        );
    }
};