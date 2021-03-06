import fetch from "node-fetch";     // Required for the async prop setters

import { GenerateUUID } from "./../core/helper";
import Subscription from "./Subscription";
import Event from "./Event";
import Listener from "./Listener";
import Watcher from "./Watcher";

//TODO Create a "prop fetch progress" object to allow for things like "Loading..." in React [ PENDING, COMPLETED, FAILURE ]
    //? Maybe create a Transaction class that gets created whenever a .fetch() is called and updates its progress as changes occur? (store Tx history in local array)
    //? Maybe erase the prop data completely whenever a new .fetch() is invoked and replace with standard/static Enum text flags (e.g. PENDING = UUID, etc.)

export default class Node {
    constructor(state = {}, events = []) {
        //* BASE
        this._ids = {};                // A generic id container for any purpose, attached to a category (e.g. [ category ] = id) (i.e. MasterNode entries)

        this._uuid = GenerateUUID();    // A UUID for this Node
        this._modules = [];             // A meta-tracker for "loaded modules"


        //* META
        this._meta = {};

        this._registerModule("meta");
        

        //* EVENTS
        this._events = {
            "error": e => e,
            "meta-change": e => e,
            "prop-change": e => e,
            "prop-change::object": e => e,
            "prop-change::array": e => e
        };

        if(events.length) {
            this.addEvent(...events);
        }

        this._listeners = {};       // Listeners receive a *specific* event (i.e. the listened event)
        this._subscribers = {};     // Subscribers receive *all* events
        this._watchers = {};        // Watchers receive the "prop-change" event when a specific prop changes (i.e. the watched prop)
        this._next = null;          // The Subscriber's method that is called when an event fires

        this._registerModule("events");

        
        //* STATE
        this._state = {};           // A contained state object for storing data within the Node

        if(Object.keys(state).length) {
            let entries = Object.entries(state);

            for(let [ key, value ] of entries) {
                this.prop(key, value);
            }
        }

        this._registerModule("state");


        //* LINKAGE
        this._links = {};

        this._registerModule("linkage");     // Functions that facilitate node-to-node interactions


        //* LINEAGE        
        this._children = {};        // Children Nodes for create Node clusters (will un/subscribe to child on .adopt()/.abandon())
        this._parent = null;        // A convenience reference to the Node's parent

        this._registerModule("lineage");
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

    getIDs() {
        return this._ids;
    }
    getID(scope) {
        return this._ids[ scope ];
    }
    setID(scope, id) {
        if(scope !== null && scope !== void 0 && id !== null && id !== void 0 && arguments.length === 2) {
            this._ids[ scope ] = id;
        }

        return this;
    }

    ID(cat, id) {
        if(cat === void 0 || cat === null) {
            return this.getIDs();
        }

        if(id === void 0) {
            return this.getID(cat);
        }

        this.setID(cat, id);

        return this;
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


    //* META
    setMeta(prop, value) {
        let oldValue = this._meta[ prop ];

        this._meta[ prop ] = value;

        let payload = {
            prop: prop,
            previous: oldValue,
            current: value
        };

        this.emit(
            "meta-change",
            payload
        );

        return this;
    }
    getMeta(prop) {
        return this._meta[ prop ];
    }
    meta(prop, value) {
        if(value === void 0) {
            return this.getMeta(prop);
        }
        
        return this.setMeta(prop, value);
    }

    metaIsEmpty(prop) {
        return this._meta[ prop ] === null || this._meta[ prop ] === void 0;
    }
    metaIsType(prop, type) {
        return typeof this._meta[ prop ] === type;
    }


    //* EVENTS
    hasEvent(name) {
        return name in this._events;
    }

    addEvent(...events) {
        for(let name of events) {
            if(typeof name === "string" || name instanceof String) {
                this._events[ name ] = e => e;
            }
        }

        return this;
    }

    on(event, callback) {
        if(typeof callback === "function") {
            this._events[ event ] = callback;
        } else {
            this._events[ event ] = null;
        }

        return this;
    }
    off(event) {
        delete this._events[ event ];

        return this;
    }

    //! This method has been rewritten to utilize "Event" and "Subscription" and no longer passes the @callback result
    emit(event, ...args) {
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

        (async (_this) => {
            for (let i in _this._listeners[ event ] ) {
                let listener = _this._listeners[ event ][ i ];

                if (listener instanceof Listener) {
                    listener.runCallback(e, listener);
                } else {
                    _this.emit("error", "Listener<" + event + "> has no method");
                }
            }

            if((event === "prop-change" || event === "prop-change::object" || event === "prop-change::array") && e instanceof Event) {
                let { prop } = e.getPayload(0);  // In "prop-change" payload object, { prop, previous, current } exist
                
                for (let i in _this._watchers[ prop ] ) {
                    let watcher = _this._watchers[ prop ][ i ];
    
                    if (watcher instanceof Watcher) {
                        watcher.runCallback(e, watcher);
                    } else {
                        _this.emit("error", `Listener<${ prop }> has no method`);
                    }
                }
            }

            for (let uuid in _this._subscribers) {
                let subscriber = _this._subscribers[ uuid ].getSubscribor();

                if (typeof subscriber._next === "function") {
                    subscriber.next(e, subscriber);
                }
            }
        })(this);

        return this;
    }
    reemit(e) {
        //? this.emit will automatically add @this as an emitter is the argument is an <Event>
        return this.emit(e);
    }
    
    /**
     * @param {string} event 
     * @param {fn} callback 
     * @returns {Listener}
     */
    listen(event, callback) {
        if(!Array.isArray(this._listeners[ event ])) {
            this._listeners[ event ] = [];
        }

        let listener = new Listener(event, callback);
        this._listeners[ event ].push(listener);

        return listener;
    }
    unlisten(listener) {
        if(listener instanceof Listener) {
            let index = this._listeners[ listener.getEvent() ].findIndex(l => {
                return l.UUID() === listener.UUID();
            });

            if(index > -1) {
                this._listeners[ listener.getEvent() ].splice(index, 1);
            }

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
    next(event) {
        if(typeof this._next === "function") {
            return this._next(event);
        }
    }

    /**
     * @param {Node} subscriber
     */
    subscribe(subscriber) {
        if(subscriber instanceof Node) {
            let subscription = new Subscription(subscriber, this);

            this._subscribers[ subscription.UUID() ] = subscription;

            return subscription;
        }

        return false;
    }
    subscribeTo(node) {
        if(node instanceof Node) {
            return node.subscribe(this);
        }

        return false;
    }
    /**
     * @param {Subscription} subscription
     */
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
    unsubscribeTo(node) {
        if(node instanceof Node) {
            return node.unsubscribe(this.UUID());
        }

        return false;
    }

    /**
     * @param {string|string[]} prop 
     * @param {fn} callback
     * @returns {Watcher|Watcher[]} Array.isArray(prop) ? Watcher[] : Watcher
     */
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


    //* STATE
    setState(state = {}) {
        this._state = state;

        return this;
    }
    getState() {
        return this._state;
    }

    setProp(prop, value, typeKey = []) {
        let oldValue = this._state[ prop ];

        this._state[ prop ] = value;

        let payload = {
            prop: prop,
            previous: oldValue,
            current: value
        };

        let [ type, key, oldValueSpecialCase, newValueSpecialCase ] = typeKey;

        this.emit(
            "prop-change",
            payload
        );

        if(type === "a" || type === "A") {
            payload[ "selector" ] = key;
            payload[ "previous" ] = oldValueSpecialCase;
            payload[ "current" ] = newValueSpecialCase;

            this.emit(
                "prop-change::array",
                payload
            );
        } else if(type === "o" || type === "O") {
            payload[ "selector" ] = key;
            payload[ "previous" ] = oldValueSpecialCase;
            payload[ "current" ] = newValueSpecialCase;

            this.emit(
                "prop-change::object",
                payload
            );
        }

        return this;
    }
    getProp(prop) {
        return this._state[ prop ];
    }
    hasProp(prop) {
        return this._state[ prop ] !== void 0;
    }

    propIsEmpty(prop) {
        return this._state[ prop ] === null || this._state[ prop ] === void 0;
    }
    propIsType(prop, type) {
        return typeof this._state[ prop ] === type;
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
                let arr = this.getProp(prop),
                    oldValue;

                if(index === -1) {
                    arr.push(value);
                } else {
                    oldValue = arr[ +index ] ;

                    arr[ +index ] = value;
                }

                return this.setProp(prop, arr, [ "a", index, oldValue, value ]);
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
                let oldValue = schema[ pList[ len - 1 ] ];
                schema[ pList[ len - 1 ] ] = value;

                return this.setProp(prop, obj, [ "o", key, oldValue, value ]);
            } else {
                return schema[ pList[ len - 1 ] ];
            }
        }
            
        return this.getProp(prop);
    }

    /**
     * This will grab a URL that expects JSON response data
     * @param {string} prop 
     * @param {string} url 
     * @param {fn} reducer A reducer function to modify the data (i.e. prop = reducer(data))
     * @param {obj} opts An options object to send to the .fetch(url, opts) [ DEFAULT: { method: "GET", mode: "cors" } ]
     */
    $prop(prop, url, { reducer = null, opts = { method: "GET", mode: "cors" }, jsonResponse = true } = {}) {
        fetch(url, opts)
            .then(response => response[ jsonResponse ? "json" : "blob" ]())
            .then(data => {
                let value;
                
                if(data === void 0) {
                    return false;
                }

                if(typeof reducer === "function") {
                    value = reducer(data);
                } else {
                    value = data;
                }

                this.setProp(prop, value);
            });
    }

    //TODO Not sure if this works, need to test on reliable endpoint
    async $propPost(prop, url) {
        let poster = async (prop, url) => {
            let response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(this.getProp(prop))
            });

            return await response;
        };

        return await poster(prop, url);
    }
    
    
    //* LINEAGE
    adopt(child) {
        if(child instanceof Node) {
            this._children[ child.UUID() ] = child;
            
            this.subscribe(child);

            child.setParent(this);
        }

        return this;
    }
    abandon(childOrUUID) {
        if(childOrUUID instanceof Node) {
            delete this._children[ child.UUID() ];
            
            this.unsubscribe(childOrUUID);
            
            child.setParent(null);
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


    //*  LINKAGE
    addLink(node) {
        if(node instanceof Node) {
            this._links[ node.UUID() ] = node;
        }

        return this;
    }
    removeLink(nodeOrUUID) {
        if(nodeOrUUID instanceof Node) {
            delete this._links[ nodeOrUUID.UUID() ];

            this.unsubscribe(nodeOrUUID.UUID());
        } else {
            delete this._links[ nodeOrUUID ];

            this.unsubscribe(nodeOrUUID);
        }

        return this;
    }

    /**
     * Creates a uni-directional link and subscription
     */
    link(...nodes) {
        for(let node of nodes) {
            if(node instanceof Node) {
                this.addLink(node);
                node.subscribe(this);
            }
        }

        return this;
    }
    /**
     * Destroys links and subscriptions uni-directionally
     */
    unlink(...nodes) {
        for(let node of nodes) {
            if(node instanceof Node) {
                this.removeLink(node);
                node.unsubscribe(this);
            }
        }

        return this;
    }    
    /**
     * Creates a bi-directional link and subscription
     * NOTE: This is not subscription safe and could result in multiple subscriptions
     */
    bilink(...nodes) {
        for(let node of nodes) {
            if(node instanceof Node) {
                this.addLink(node);
                node.addLink(this);

                this.subscribe(node);
                node.subscribe(this);
            }
        }

        return this;
    }
    /**
     * Destroys links and subscriptions bi-directionally
     */
    unbilink(...nodes) {
        for(let node of nodes) {
            if(node instanceof Node) {
                this.removeLink(node);
                node.removeLink(this);

                this.unsubscribe(node);
                node.unsubscribe(this);
            }
        }

        return this;
    }

    //TODO .copy(qty = 1)  // Make a copy of the node
    //TODO .replicate(node) // Copy this._state into @node._state
    //TODO ...etc of similar convenience methods
};