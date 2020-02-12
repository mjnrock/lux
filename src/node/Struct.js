import { GenerateUUID } from "../core/helper";

import Node from "./Node";
import Watcher from "./Watcher";
import Subscription from "./Subscription";
import Event from "./Event";

export default class Struct {
    constructor(state = {}) {
        this._uuid = GenerateUUID();

        this._state = state;
        this._subscriptions = {};

        this._trackers = {};

        for(let [ key, value ] of Object.entries(this._state)) {
            if(value instanceof Struct) {
                value.subscribe(this.bubble.bind(this));

                this._trackers[ value.UUID() ] = key;
            }
        }

        return new Proxy(this, {
            get: (obj, prop) => {
                if(obj._state[ prop ]) {
                    return obj._state[ prop ];
                }
                
                return obj[ prop ];
            },
            set: (obj, prop, value) => {
                if(prop in obj._state) {
                    let oldValue = obj._state[ prop ];

                    obj._state[ prop ] = value;

                    obj.broadcast(Struct.PackageEventChange(this, prop, value, oldValue));
                }

                return true;
            }
        });
    }

    UUID() {
        return this._uuid;
    }

    broadcast(e) {
        if(e instanceof Event) {
            (async _this => {
                for(let sub of Object.values(this._subscriptions)) {
                    if(sub instanceof Subscription) {
                        sub.getSubscribor().next(e);
                    } else if(typeof sub.next === "function") {
                        sub.next(e);
                    } else if(typeof sub === "function") {
                        sub(e);
                    }
                }
            })(this);
        }
    }

    subscribe(nodeNextOrFn) {
        if(nodeNextOrFn instanceof Node) {
            let sub = new Subscription(nodeNextOrFn, this);

            this._subscriptions[ sub.UUID() ] = sub;
        } else if(typeof nodeNextOrFn === "function" || typeof nodeNextOrFn.next === "function") {
            this._subscriptions[ GenerateUUID() ] = nodeNextOrFn;
        }

        return this;
    }
    unsubscribe(subOrUUID) {
        if(subOrUUID instanceof Subscription) {
            delete this._subscriptions[ subOrUUID.UUID() ];
        } else {
            delete this._subscriptions[ subOrUUID ];
        }

        return this;
    }

    bubble(e) {
        if(e instanceof Event && e.getType() === "change") {
            let key = this._trackers[ e.getEmitter().UUID() ];

            if(key) {
                let { prop, current, previous } = e.getPayload();

                this.broadcast(Struct.PackageEventChange(this, [ key, ...prop ], current, previous));
            }
        }
    }

    

    static PackageEventChange(emitter, prop, current, previous) {
        let props = Array.isArray(prop) ? prop : [ prop ];
        
        return new Event("change", {
            prop: props,
            current: current,
            previous: previous
        }, emitter)
    }
    static GetBubbleProp(scope, prop, removeProps = 0) {
        let value = scope;

        prop.slice(0, prop.length - removeProps).forEach(v => {
            value = value[ v ];
        });

        return value;
    }
};