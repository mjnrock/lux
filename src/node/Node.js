import { GenerateUUID } from "./../core/helper";

export default class Node {
    constructor() {
        //* BASE
        this._id = null;                // A generic id for any purpose
        this._uuid = GenerateUUID();    // A UUID for this Node
        this._modules = [];             // A meta-tracker for "loaded modules"
        

        //* EVENTS
        this._events = {
            "error": (target, ...args) => args,
            "prop-change": (target, ...args) => args
        };

        this._listeners = {};       // Listeners receive a *specific* event (i.e. the listened event)
        this._subscribers = {};     // Subscribers receive *all* events
        this._watchers = {};        // Watchers receive the "prop-change" event when a specific prop changes (i.e. the watched prop)
        this._next = null;          // The Subscriber's method that is called when an event fires

        this._registerModule("events");

        
        //* STATE
        this._state = {};           // A contained state object for storing data within the Node

        this._registerModule("state");


        //* PROGENY        
        this._children = {};        // Children Nodes for create Node clusters
        this._parent = null;        // A convenience reference to the Node's parent

        this._registerModule("progeny");
    }

    //* BASE
    _registerModule(code) {
        if(!this._modules.includes(code)) {
            this._modules.push(code);
        }

        return this;
    }
    _hasModule(code) {
        return this._modules.includes(code);
    }

    ID(id = null) {
        if(id !== null && id !== void 0) {
            this._id = id;

            return this;
        }

        return this._id;
    }

    UUID(uuid = null) {
        if(uuid === true) {
            this._uuid = GenerateUUID();
        } else if(uuid !== null && uuid !== void 0) {
            let regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/, "i");

            if(regex.test(uuid)) {
                this._uuid = uuid;
            } else {
                throw new Error("[Invalid UUID]: @uuid is did not pass a UUID RegEx check.  Invoke 'this.UUID(true)' to auto-generate.");
            }
        } else {
            return this._uuid;
        }

        return this;
    }

    //* EVENTS
    hasEvent(name) {
        return typeof this._events[ name ] === "function";
    }

    on(event, callback) {
        if(typeof callback !== "function") {
            callback = (...args) => [ ...args ];
        }
        
        this._events[ event ] = callback;

        return this;
    }
    off(event) {
        delete this._events[ event ];

        return this;
    }

    call(event, ...args) {
        let fn = this._events[ event ];

        if(typeof fn === "function") {
            let result = fn(this, ...args),
                _this = this;

            (async () => {
                for (let i in _this._listeners[ event] ) {
                    let listener = _this._listeners[ event ][ i ];

                    if (typeof listener === "function") {
                        listener(result, [ event, _this ]);
                    } else {
                        _this.call("error", "Listener<" + event + "> has no method");
                    }
                }

                for (let uuid in _this._subscribers) {
                    let subscriber = _this._subscribers[ uuid ];

                    if (typeof subscriber._next === "function") {
                        subscriber.next(event, result, this);
                    }
                }
            })();
            // setTimeout(() => {
            //     for (let i in _this._listeners[ event] ) {
            //         let listener = _this._listeners[ event ][ i ];

            //         if (typeof listener === "function") {
            //             listener(result, [ event, _this ]);
            //         } else {
            //             _this.call("error", "Listener<" + event + "> has no method");
            //         }
            //     }

            //     for (let uuid in _this._subscribers) {
            //         let subscriber = _this._subscribers[ uuid ];

            //         if (typeof subscriber._next === "function") {
            //             subscriber.next(event, result, this);
            //         }
            //     }
            // }, 1);

            return result;
        }

        throw new Error(`"${ event }" has no method.`);
    }
    
    /**
     * Attach a listener to an event
     * a.listen("error", ([ message ], [ event, target ]) => {
     *    console.log(event)
     *    console.log(message)
     *    console.log(target)
     * });
     * @param {string} event 
     * @param {fn} callback 
     * @returns {uuid}
     */
    listen(event, callback) {
        if(typeof this._listeners[ event ] !== "object") {
            this._listeners[ event ] = {};
        }
        // if(!Array.isArray(this._listeners[ event ])) {
        //     this._listeners[ event ] = [];
        // }

        let uuid = GenerateUUID();
        this._listeners[ event ][ uuid ] = callback;

        return uuid;
    }
    unlisten(event, uuid) {
        // throw new Error("This method has not been setup yet.  Implement a search system, maybe use UUIDs?");        
        if(typeof this._listeners[ event ] === "object") {
            delete this._listeners[ event ][ uuid ];
            
            return true;
        }
        
        return false;
    }

    getNext() {
        return this._next;
    }
    setNext(next) {
        if(typeof next === "function") {
            this._next = next;
        }

        return this;
    }
    next(caller, event, ...args) {
        if(typeof this._next === "function") {
            return this._next(caller, event, ...args);
        }
    }

    subscribe(subscriber) {
        if(subscriber instanceof Node) {
            this._subscribers[ subscriber.UUID() ] = subscriber;

            return this;
        }

        return false;
    }
    unsubcriber(subscriberOrUUID) {
        if(typeof subscriberOrUUID === "string" || subscriberOrUUID instanceof String) {
            delete this._subscribers[ subscriberOrUUID ];

            return this;
        } else if(subscriber instanceof Node) {
            delete this._subscribers[ subscriberOrUUID.UUID() ];

            return this;
        }

        return false;
    }

    /**
     * Attach listener(s) to watch a state property, returning the registry UUID(s) of the attachment(s).  If 
     * 
     * Example:
     * a.watch([ "cat", "dog" ], (key, value) => {
     *     console.log(key, value)
     * });
     * @param {string|Array} prop 
     * @param {fn} callback
     * @returns {uuid|uuids} If `Array.isArray(prop)`, then `@uuids = { prop: uuid, ... }`, else `@uuid = uuid`
     */
    watch(prop, callback) {
        if(Array.isArray(prop)) {
            let uuids = {};

            prop.forEach(p => {
                uuids[ p ] = this.listen("prop-change", ([ key, value ], [ event, target ]) => {
                    if(p === key && typeof callback === "function") {
                        callback(key, value, target);
                    }
                });
            });

            return uuids;
        }
        
        let uuid = this.listen("prop-change", ([ key, value ], [ event, target ]) => {
            if(prop === key && typeof callback === "function") {
                callback(key, value, target);
            }
        });

        this._watchers[ uuid ] = prop;
        
        return uuid;
    }
    unwatch(uuid) {
        // throw new Error("This method has not been setup yet.  Implement a search system, maybe use UUIDs?");
        if(typeof this._listeners[ "prop-change" ] === "object") {
            delete this._listeners[ "prop-change" ][ uuid ];
            delete this._watchers[ uuid ];
            
            return true;
        }
        
        return false;
    }


    //* STATE
    setState(state = {}) {
        this._state = state;

        return this;
    }
    getState() {
        return this;
    }

    setProp(prop, value) {
        let oldValue = this._state[ prop ];

        this._state[ prop ] = value;

        if(Object.keys(this._listeners).length || Object.keys(this._subscribers).length) {
            this.call("prop-change", prop, value, oldValue);
        }

        return this;
    }
    getProp(prop) {
        return this._state[ prop ];
    }
    /**
     * Acts as a getter/setter for this.state[ @prop ] = @value
     * @param {string} prop 
     * @param {any} ?value
     */
    prop(prop, value) {
        if(value !== void 0) {
            return this.setProp(prop, value);
        }
        
        return this.getProp(prop);
    }

    aprop(prop, index, value) {
        if(index !== void 0) {
            if(value !== void 0) {
                let arr = this.getProp(prop);

                arr[ +index ] = value;

                return this.setProp(prop, arr);
            } else {
                return this.getProp(prop)[ +index ];
            }
        }
            
        return this.getProp(prop);
    }

    oprop(prop, key, value) {
        if(key !== void 0) {
            let obj = this.getProp(prop);  // a moving reference to internal objects within obj
            let schema = this.getProp(prop);  // a moving reference to internal objects within obj
            let pList = key.split(".");
            let len = pList.length;

            for(let i = 0; i < len - 1; i++) {
                let elem = pList[ i ];

                if(!schema[ elem ]) {
                    schema[ elem ] = {};
                }

                schema = schema[ elem ];
            }

            if(value !== void 0) {
                schema[ pList[ len - 1 ] ] = value;

                return this.setProp(prop, obj);
            } else {
                return schema;
            }
        }
            
        return this.getProp(prop);
    }


    //* PROGENY
    adopt(child) {
        if(child instanceof Node) {
            this._children[ child.UUID() ] = child;
        }

        return this;
    }
    abandon(childOrUUID) {
        if(childOrUUID instanceof Node) {
            delete this._children[ child.UUID() ];
        } else if(typeof childOrUUID === "string" || childOrUUID instanceof String) {
            delete this._children[ childOrUUID ];
        }

        return this;
    }

    getChild(uuid) {
        return this._children[ uuid ];
    }
    setChild(uuid, child) {
        this._children[ uuid ] = child;

        return this;
    }

    getParent() {
        return this._parent;
    }
    setParent(value) {
        this._parent = value;

        return this;
    }

    child(uuid, child) {
        if(child === void 0) {
            return this.getChild(uuid);
        }
        
        return this.setChild(uuid, child);
    }
    parent(value) {
        if(value === void 0) {
            return this.getParent();
        }
        
        return this.setParent(value);
    }
};