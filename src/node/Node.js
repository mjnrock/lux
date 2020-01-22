import { GenerateUUID } from "./../core/helper";
import Subscription from "./Subscription";
import Event from "./Event";

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
        this._children = {};        // Children Nodes for create Node clusters (will un/subscribe to child on .adopt()/.abandon())
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
        return name in this._events;
    }

    addEvent(...events) {
        for(let name of events) {
            if(typeof name === "string" || name instanceof String) {
                this._events[ name ] = null;
            }
        }

        return this;
    }

    on(event, callback) {
        if(typeof callback !== "function") {
            callback = null;
        }
        
        this._events[ event ] = callback;

        return this;
    }
    off(event) {
        delete this._events[ event ];

        return this;
    }

    //! This method has been rewritten to utilize "Event" and "Subscription" and no longer passes the @callback result
    call(event, ...args) {
        let e;
        if(event instanceof Event) {
            e = event;
            event = e.getType();    // This is to avoid passing a class to the objects below (in the case of chain event calling) and I'm otherwise too lazy to refactor, as I don't see the need

            e.addEmitter(this);     // Add this Node to the emitter list
        } else if(typeof event === "string" || event instanceof String) {
            e = new Event(event, args, this);
        }

        if(!(event in this._events)) {
            throw new Error(`[Invalid Event]: "${ event }" has not been registered`);
        }

        if(typeof this._events[ event ] === "function") {
            this._events[ event ](e);
        }

        (async () => {
            for (let i in _this._listeners[ event] ) {
                let listener = _this._listeners[ event ][ i ];

                if (typeof listener === "function") {
                    listener(e);
                } else {
                    _this.call("error", "Listener<" + event + "> has no method");
                }
            }

            for (let uuid in _this._subscribers) {
                let subscriber = _this._subscribers[ uuid ].getSubscribor();

                if (typeof subscriber._next === "function") {
                    subscriber.next(e);
                }
            }
        })();

        return this;
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
            // this._subscribers[ subscriber.UUID() ] = subscriber;
            this._subscribers[ subscriber.UUID() ] = new Subscription(subscriber, this);

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
            
            this.subscribe(child);
        }

        return this;
    }
    abandon(childOrUUID) {
        if(childOrUUID instanceof Node) {
            delete this._children[ child.UUID() ];
            
            this.unsubscribe(childOrUUID);
        } else if(typeof childOrUUID === "string" || childOrUUID instanceof String) {
            delete this._children[ childOrUUID ];
            
            this.unsubscribe(childOrUUID);
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