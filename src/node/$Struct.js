import { GenerateUUID } from "../core/helper";

import Node from "./Node";
import Watcher from "./Watcher";
import Subscription from "./Subscription";
import Event from "./Event";

export default class Struct {
    constructor(state = {}, validators = {}) {
        this._uuid = GenerateUUID();

        this._state = state;
        this._validators = validators;

        this._watchers = {};
        this._subscribers = {};

        return new Proxy(this, {
            get: (obj, prop) => {
                if(typeof this[ prop ] === "function" || [ "_subscribers", "_watchers" ].includes(prop)) {
                    return this[ prop ];
                }
                
                return this._state[ prop ];
            },
            set: (obj, prop, value) => {
                let shouldProceed;
                
                if(this._validators[ prop ]) {
                    shouldProceed = false;

                    if(typeof this._validators[ prop ] === "function") {
                        shouldProceed = this._validators[ prop ](value, prop);
                    } else if(this._validators[ prop ] instanceof RegExp) {
                        shouldProceed = this._validators[ prop ].test(value);
                    }
                } else if(!(prop in this._state)) {
                    shouldProceed = false;
                } else {
                    shouldProceed = true;
                }

                if(shouldProceed === true) {
                    let oldValue = this._state[ prop ];
                    this._state[ prop ] = value;

                    let e = new Event("change", {
                        prop: prop,
                        previous: oldValue,
                        current: value
                    }, this);                

                    (async (_this) => {
                        for(let i in _this._watchers[ prop ] ) {
                            let watcher = _this._watchers[ prop ][ i ];
            
                            if (watcher instanceof Watcher) {
                                watcher.runCallback(e, watcher);
                            }
                        }
            
                        for(let uuid in _this._subscribers) {
                            let subscriber = _this._subscribers[ uuid ].getSubscribor();
            
                            if (typeof subscriber._next === "function") {
                                subscriber.next(e, subscriber);
                            }
                        }
                    })(this);
                }

                return this;
            }
        });
    }

    UUID() {
        return this._uuid;
    }

    watch(prop, callback) {
        if(Array.isArray(prop)) {
            let watchers = {};

            prop.forEach(p => {
                if(!Array.isArray(this._watchers[ p ])) {
                    this._watchers[ p ] = [];
                }

                //  Populate this._watchers
                let watcher = new Watcher(p, callback);
                this._watchers[ p ].push(watcher);

                //  Populate the return variable
                if(!Array.isArray(watchers[ p ])) {
                    watchers[ p ] = [];
                }
                watchers[ p ].push(watcher);
            });

            return watchers;
        } else {
            if(!Array.isArray(this._watchers[ prop ])) {
                this._watchers[ prop ] = [];
            }

            let watcher = new Watcher(prop, callback);
            this._watchers[ prop ].push(watcher);

            return watcher;
        }
    }
    unwatch(watcher) {
        if(watcher instanceof Watcher) {
            let index = this._watchers[ watcher.getProp() ].findIndex(w => {
                return w.UUID() === watcher.UUID();
            });

            if(index > -1) {
                this._watchers[ watcher.getProp() ].splice(index, 1);
            }

            return true;
        }
        
        return false;
    }
    subscribe(subscriber) {
        if(subscriber instanceof Node) {
            let subscription = new Subscription(subscriber, this);

            this._subscribers[ subscription.UUID() ] = subscription;

            return subscription;
        }

        return false;
    }
    unsubscribe(subscriptionOrUUID) {
        if(subscriptionOrUUID instanceof Subscription) {
            delete this._subscribers[ subscriptionOrUUID.UUID() ];
        } else {
            if(this._subscribers[ subscriptionOrUUID ]) {
                delete this._subscribers[ subscriptionOrUUID ];
            } else {
                for(let subscription of Object.values(this._subscribers)) {

                    if(subscription.getSubscribor().UUID() === subscriptionOrUUID || subscription.getSubscribee().UUID() === subscriptionOrUUID) {
                        delete this._subscribers[ subscription.UUID() ];

                        return;
                    }
                }
            }
        }

        return false;
    }
};