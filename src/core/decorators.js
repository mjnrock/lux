//! ------------------------------------------------------------------------------------------------------------------
//! The ClassDecorators version is new and largely untested, and previous attempts had several failures points.
//! THOROUGHLY test them before abandoning this version
//! ------------------------------------------------------------------------------------------------------------------

import { GenerateUUID } from "./helper";

export function Provenance(target = {}) {
    return Object.assign(target, {
        UUID: GenerateUUID(),
        _meta: {},

        setMeta(meta = {}) {
            this._meta = meta;

            return this;
        },
        getMeta() {
            return this._meta;
        },
        meta(prop, value) {
            if(value === void 0) {
                return this.getMeta(prop);
            }
            
            return this.setMeta(prop, value);
        }
    });
};

export function Events(target = {}) {
    return Object.assign(target, {
        _events: {
            "error": (target, ...args) => args,
            "prop-change": (target, ...args) => args
        },
        _listeners: {},

        hasEvent(name) {
            return typeof this._events[ name ] === "function";
        },

        on(event, callback) {
            if(typeof callback !== "function") {
                callback = (...args) => [ ...args ];
            }
            
            this._events[ event ] = callback;

            return this;
        },
        off(event) {
            delete this._events[ event ];

            return this;
        },

        call(event, ...args) {
            let fn = this._events[ event ];

            if(typeof fn === "function") {
                let result = fn(this, ...args),
                    _this = this;

                (async function() {
                    for(let i in _this._listeners[ event ]) {
                        let listener = _this._listeners[ event ][ i ];

                        if(typeof listener === "function") {
                            listener(result, [ event, _this]);
                        } else {
                            _this.call("error", `Listener<${ event }> has no method`);
                        }
                    }
                })();

                return result;
            }

            throw new Error(`"${ event }" has no method.`);
        },
        
        /**
         * Attach a listener to an event
         * a.listen("error", ([ message ], [ event, target ]) => {
         *    console.log(event)
         *    console.log(message)
         *    console.log(target)
         * });
         * @param {string} event 
         * @param {fn} callback 
         */
        listen(event, callback) {
            if(!Array.isArray(this._listeners[ event ])) {
                this._listeners[ event ] = [];
            }

            this._listeners[ event ].push(callback);

            return this;
        },
        unlisten(event, target) {
            throw new Error("This method has not been setup yet.  Implement a search system, maybe use UUIDs?");
        },

        /**
         * Attach a listener to watch a state property
         * 
         * Example:
         * a.watch([ "cat", "dog" ], (key, value) => {
         *     console.log(key, value)
         * });
         * @param {string|Array} prop 
         * @param {fn} callback 
         */
        watch(prop, callback) {
            if(Array.isArray(prop)) {
                prop.forEach(p => {
                    this.listen("prop-change", ([ key, value ], [ event, target ]) => {
                        if(p === key && typeof callback === "function") {
                            callback(key, value, target);
                        }
                    });
                });

                return this;
            }
            
            this.listen("prop-change", ([ key, value ], [ event, target ]) => {
                if(prop === key && typeof callback === "function") {
                    callback(key, value, target);
                }
            });
            
            return this;
        },
        unwatch(prop) {
            throw new Error("This method has not been setup yet.  Implement a search system, maybe use UUIDs?");
        }
    });
}

export function State(target = {}) {
    return Object.assign(target, Events({
        _state: {},
        
        setState(state = {}) {
            this._state = state;

            return this;
        },
        getState() {
            return this;
        },

        setProp(prop, value) {
            let oldValue = this._state[ prop ];

            this._state[ prop ] = value;

            if(Object.keys(this._listeners).length) {
                this.call("prop-change", prop, value, oldValue);
            }

            return this;
        },
        getProp(prop) {
            return this._state[ prop ];
        },
        /**
         * Acts as a getter/setter for this.state[ @prop ] = @value
         * @param {string} prop 
         * @param {any} ?value
         */
        prop(prop, value) {
            if(value === void 0) {
                return this.getProp(prop);
            }
            
            return this.setProp(prop, value);
        }
    }));
}

export function Behavior(target = {}) {
    return Object.assign(target, {
        _actions: {},

        getAction() {
            return this._actions;
        },
        setActions(actions = {}) {
            this._actions = actions;

            return this;
        },

        learn(name, action) {
            this._actions[ name ] = action;

            return this;
        },
        unlearn(name) {
            delete this._actions[ name ];

            return this;
        },

        do(name, ...args) {
            let action = this._actions[ name ];

            if(typeof action === "function") {
                return action(...args);
            }

            throw new Error("Action has no method");
        }
    });
}

export function Progeny(target = {}) {
    return Object.assign(target, {
        _children: [],
        _parent: null,

        birth(child) {
            this._children.push(child);

            return this;
        },
        abort(index) {
            this._children.splice(index, 1);

            return this;
        },

        getChild(index) {
            return this._children[ index ];
        },
        setChild(index, child) {
            this._children[ index ] = child;

            return this;
        },

        getParent() {
            return this._parent;
        },
        setParent(value) {
            this._parent = value;

            return this;
        },

        child(index, child) {
            if(child === void 0) {
                return this.getChild(index);
            }
            
            return this.setChild(index, child);
        },
        parent(value) {
            if(value === void 0) {
                return this.getParent();
            }
            
            return this.setParent(value);
        }
    });
}

export function Group(target = {}) {
    return Object.assign(target, {
        _groupArchetype: null,
        _group: null,
        _groupMap: {
            "send": null,
            "receive": null,
            "broadcast": null
        },

        groupMap(prop, fn) {
            if(prop in this._groupMap && typeof fn === "function") {
                this._groupMap[ prop ] = fn;
            }

            return this;
        },

        getGroup() {
            return this._group;
        },
        setGroup(group) {
            if(this._group instanceof this._groupArchetype) {
                this._group = group;
            }
        },

        getGroupArchetype() {
            return this._groupArchetype;
        },
        setGroupArchetype(groupArchetype) {
            this._groupArchetype = groupArchetype;

            return this;
        },

        send(to, msg) {
            if(this._group instanceof this._groupArchetype && typeof this._groupMap[ "send" ] === "function") {
                return this._groupMap[ "send" ](to, msg);
            }

            return false;
        },
        receive(msg) {
            if(this._group instanceof this._groupArchetype && typeof this._groupMap[ "receive" ] === "function") {
                let response = this._groupMap[ "receive" ](msg);

                return response;
            }

            return false;
        },

        broadcast(msg) {
            if(this._group instanceof this._groupArchetype && typeof this._groupMap[ "broadcast" ] === "function") {
                return this._groupMap[ "broadcast" ](msg);
            }

            return false;
        },

        join(group) {
            return this.setGroup(group);
        },
        leave() {
            this.setGroup(null);
        }
    });
}

export function Merge(subject, addon, doMerge = false) {
    if(doMerge) {
        subject = Object.assign(subject, addon);

        return subject;
    }

    return Object.assign(subject, addon);
}
export function Apply(decorators = [], subject = {}, doMerge = false) {
    if(doMerge) {
        for(let i in decorators) {
            let dec = decorators[ i ];

            if(typeof dec === "function") {
                subject = dec(subject);
            }
        }

        return subject;
    }

    let target = subject;
    for(let i in decorators) {
        let dec = decorators[ i ];

        if(typeof dec === "function") {
            target = dec(target);
        }
    }

    return target;
}

export function ApplyAll(target = {}) {
    return Apply([
        Group,
        Progeny,
        Behavior,
        Provenance,
        State,
    ], target);
}

export default {    
    Provenance,
    Events,
    State,
    Behavior,
    Progeny,
    Group,

    Merge,
    Apply,
    ApplyAll
}