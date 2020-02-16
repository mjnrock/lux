import React, { Component } from "react";
import Context from "./Context";

class ObserverComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {        
        let _this = this,
            fn = () => {
                _this.context.BATCH.EventCount = 0;
                _this.context.BATCH.Timeouts = [];
 
                _this.forceUpdate();
            };

        this.context.addReaction("change", e => {
            _this.context.BATCH.EventCount += 1;
            _this.context.BATCH.Timeouts.push(setTimeout(() => fn(), _this.context.BATCH.Threshold));

            if(_this.context.BATCH.EventCount > 1) {
                _this.context.BATCH.Timeouts.forEach(t => clearTimeout(t));
                _this.context.BATCH.Timeouts = [];

                _this.context.BATCH.Timeouts.push(setTimeout(() => fn(), _this.context.BATCH.Threshold));
            }
        });
    }
};

Context.Observer.BATCH = {
    EventCount: 0,
    Timeouts: [],
    Threshold: 10
};
ObserverComponent.contextType = Context.ObserverContext;

export default ObserverComponent;