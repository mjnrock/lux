import { GenerateUUID } from "./helper";

//TODO Use Subscriptions to track this any watching behavior, utilize the Subscription specific to each class

//? This is the important base function for inheritence
//? e.g.  export default class Attribute extends ClassDecorators.Events(ClassDecorators.State(ClassDecorators.DecoratorBase)) {}

class DecoratorBase {
    constructor() {
        this._id = null;   // A generic id for any purpose
        this._uuid = GenerateUUID();
        this._modules = [];
    }

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
};

const Events = (Events) => class extends Events {
    constructor() {
        super();

        this._events = {
            "error": (target, ...args) => args,
            "prop-change": (target, ...args) => args
        };

        this._listeners = {};
        this._watchers = {};

        this._registerModule("events");
    }

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
    unwatch(prop, uuid) {
        // throw new Error("This method has not been setup yet.  Implement a search system, maybe use UUIDs?");
        if(typeof this._listeners[ "prop-change" ] === "object") {
            delete this._listeners[ "prop-change" ][ uuid ];
            delete this._watchers[ uuid ];
            
            return true;
        }
        
        return false;
    }
}

const State = (State) => class extends State {
    constructor() {
        super();
        
        this._state = {};

        this._registerModule("state");
    }

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

        if(Object.keys(this._listeners).length) {
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
        if(value === void 0) {
            return this.getProp(prop);
        }
        
        return this.setProp(prop, value);
    }
};

const Meta = (Meta) => class extends Meta {
    constructor() {
        super();

        this._meta = {};

        this._registerModule("meta");
    }

    setMeta(meta = {}) {
        this._meta = meta;

        return this;
    }
    getMeta() {
        return this._meta;
    }
    meta(prop, value) {
        if(value === void 0) {
            return this.getMeta(prop);
        }
        
        return this.setMeta(prop, value);
    }
};

const Behavior = (Behavior) => class extends Behavior {
    constructor() {
        super();
        
        this._actions = {};

        this._registerModule("behavior");
    }

    getAction() {
        return this._actions;
    }
    setActions(actions = {}) {
        this._actions = actions;

        return this;
    }

    learn(name, action) {
        this._actions[ name ] = action;

        return this;
    }
    unlearn(name) {
        delete this._actions[ name ];

        return this;
    }

    do(name, ...args) {
        let action = this._actions[ name ];

        if(typeof action === "function") {
            return action(...args);
        }

        throw new Error("Action has no method");
    }
};

const Progeny = (Progeny) => class extends Progeny {
    constructor() {
        super();
        
        this._children = {};
        this._parent = null;

        this._registerModule("progeny");
    }

    birth(child) {
        this._children.push(child);

        return this;
    }
    abort(index) {
        this._children.splice(index, 1);

        return this;
    }

    getChild(index) {
        return this._children[ index ];
    }
    setChild(index, child) {
        this._children[ index ] = child;

        return this;
    }

    getParent() {
        return this._parent;
    }
    setParent(value) {
        this._parent = value;

        return this;
    }

    child(index, child) {
        if(child === void 0) {
            return this.getChild(index);
        }
        
        return this.setChild(index, child);
    }
    parent(value) {
        if(value === void 0) {
            return this.getParent();
        }
        
        return this.setParent(value);
    }
};


const Group = (Group) => class extends Group {
    constructor() {
        super();
        
        this._groupArchetype = null;
        this._group = null;
        this._groupMap = {
            "send": null,
            "receive": null,
            "broadcast": null
        };

        this._registerModule("group");
    }

    groupMap(prop, fn) {
        if(prop in this._groupMap && typeof fn === "function") {
            this._groupMap[ prop ] = fn;
        }

        return this;
    }

    getGroup() {
        return this._group;
    }
    setGroup(group) {
        if(this._group instanceof this._groupArchetype) {
            this._group = group;
        }
    }

    getGroupArchetype() {
        return this._groupArchetype;
    }
    setGroupArchetype(groupArchetype) {
        this._groupArchetype = groupArchetype;

        return this;
    }

    send(to, msg) {
        if(this._group instanceof this._groupArchetype && typeof this._groupMap[ "send" ] === "function") {
            return this._groupMap[ "send" ](to, msg);
        }

        return false;
    }
    receive(msg) {
        if(this._group instanceof this._groupArchetype && typeof this._groupMap[ "receive" ] === "function") {
            let response = this._groupMap[ "receive" ](msg);

            return response;
        }

        return false;
    }

    broadcast(msg) {
        if(this._group instanceof this._groupArchetype && typeof this._groupMap[ "broadcast" ] === "function") {
            return this._groupMap[ "broadcast" ](msg);
        }

        return false;
    }

    join(group) {
        return this.setGroup(group);
    }
    leave() {
        this.setGroup(null);
    }
};

//* This is to allow for "class instanceof StateEvents" and as a convenience super class
class StateEvents extends Events(State(DecoratorBase)) {
    constructor() {
        super();
    }
};
//* This is to allow for "class instanceof MetaStateEvents" and as a convenience super class
class MetaStateEvents extends Meta(Events(State(DecoratorBase))) {
    constructor() {
        super();
    }
};

export default {    
    DecoratorBase,
    Events,
    State,
    Meta,
    Behavior,
    Progeny,
    Group,

    StateEvents,
    MetaStateEvents,
}