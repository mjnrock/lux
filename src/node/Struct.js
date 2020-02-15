import fetch from "node-fetch";     // Required for the async prop setters
import { GenerateUUID } from "../core/helper";

import Node from "./Node";
import Subscription from "./Subscription";
import Event from "./Event";

//! This class will NOT allow for new additions to its _state.  Once it has been initialized, props cannot be added, only updated.
    // If using .GET, ensure that the holding prop has been setup (e.g. { [ GET_RESULT_PROP ]: null })
export default class Struct {
    constructor(state = {}, validators = {}) {
        this._uuid = GenerateUUID();

        this._state = state;
        this._validators = validators;  // Optional: allows for fn => true|false or RegExp validations to determine if an update should occur

        this._subscriptions = {};   // A { UUID: Subscription|nextable|fn } KVP.  If entry is nextable or a fn, a UUID will be automatically generated for internal use
        // this._trackers = {};    // A helper mapper to bind Struct UUIDs to a _state key

        // for (let [key, value] of Object.entries(this._state)) {
        //     if (value instanceof Struct) {
        //         value.subscribe(this.bubble.bind(this));

        //         this._trackers[value.UUID()] = key;
        //     }
        // }

        return new Proxy(this, {
            get: (obj, prop) => {
                if (obj._state[prop]) {    // Allow proxy to look into state as a first priority, else return the native prop
                    return obj._state[prop];
                }

                return obj[prop];
            },
            set: (obj, prop, value) => {
                if (prop in obj._state) {    // Only allow state manipulations to a <Struct> to functionally freeze the instantiation
                    let shouldProceed = true;   // Default to proceed if validator does not exist for @prop

                    if (this._validators[prop]) {
                        shouldProceed = false;  // Override default to false if a validator exists | Validator will then determine if should proceed

                        if (typeof this._validators[prop] === "function") {
                            shouldProceed = this._validators[prop](value, prop);
                        } else if (this._validators[prop] instanceof RegExp) {
                            shouldProceed = this._validators[prop].test(value);
                        }
                    }

                    if (shouldProceed === true) {    // Force correct behavior of validator by not allowing truthy/falsey values
                        let oldValue = obj._state[prop];

                        obj._state[prop] = value;

                        obj.broadcast(Struct.PackageEventChange(this, prop, value, oldValue));
                    }
                }

                return true;
            }
        });
    }

    GET(prop, url, { reducer = null, opts = { method: "GET", mode: "cors" }, jsonResponse = true } = {}) {
        let _this = this;

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

                _this[ prop ] = value;
            });
    }
    //TODO Untested
    async POST(prop, url) {
        let poster = async (prop, url) => {
            let response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(this[ prop ])
            });

            return await response;
        };

        return await poster(prop, url);
    }

    /**
     * Alias exposure for this._uuid
     */
    UUID() {
        return this._uuid;
    }

    /**
     * The functional equivalent of Node.emit() for Structs
     * @param {*} e 
     */
    broadcast(e) {
        if (e instanceof Event) {
            (async _this => {
                for (let sub of Object.values(this._subscriptions)) {
                    if (sub instanceof Subscription) {
                        sub.getSubscribor().next(e);
                    } else if (typeof sub.next === "function") {
                        sub.next(e);
                    } else if (typeof sub === "function") {
                        sub(e);
                    }
                }
            })(this);
        }
    }

    /**
     * Operates similarly, but not identically, to the Node.subscribe().  It is a "combination" of Node.subscribe(), a nextable, and a callback.
     * @param {Node|nextable|fn} nodeNextOrFn 
     * @returns {string<UUID>|false} Will return of the Node (if passed), or the generated UUID if a nextable or function was passed
     */
    subscribe(nodeNextOrFn) {
        let uuid,
            sub;

        if (nodeNextOrFn instanceof Node) {
            sub = new Subscription(nodeNextOrFn, this);
            uuid = sub.UUID();
        } else if (typeof nodeNextOrFn === "function" || typeof nodeNextOrFn.next === "function") {
            sub = nodeNextOrFn;
            uuid = GenerateUUID();
        }

        if (uuid) {
            this._subscriptions[uuid] = sub;

            return uuid;
        }

        return false;
    }
    /**
     * !Important: Make sure to pass the <Subscription> or the UUID of the <Subscription>, NOT the subscriber
     * Passing a function has not been tested, but it might work :)
     * @param {Subscription|string<UUID>} subOrUUID 
     */
    unsubscribe(subOrUUID) {
        let hashCode = str => {
            let hash = 0, i, chr;

            if(str.length === 0) {
                return hash;
            }

            for(i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        };

        if (subOrUUID instanceof Subscription) {
            delete this._subscriptions[subOrUUID.UUID()];
        } else if (typeof subOrUUID === "string" || subOrUUID instanceof String) {
            delete this._subscriptions[subOrUUID];
        } else if (typeof subOrUUID.next === "function" || typeof subOrUUID === "function") {
            let fn = subOrUUID.next || subOrUUID,
                hash = hashCode(fn.toString());

            for (let [key, sub] of Object.entries(this._subscriptions)) {
                if (typeof sub.next === "function" || typeof sub === "function") {
                    let ifn = sub.next || sub;

                    if (hashCode(ifn.toString()) === hash) {
                        delete this._subscriptions[key];

                        return this;
                    }
                }
            }
        }

        return this;
    }

    // /**
    //  * This is to allow for the nesting of Structs.  The e._payload.prop array will gain additional values for each level of bubbling.
    //  * @param {Event} e 
    //  */
    // bubble(e) {
    //     if (e instanceof Event && e.getType() === "change") {
    //         let key = this._trackers[e.getEmitter().UUID()];

    //         if (key) {
    //             let { prop, current, previous } = e.getPayload();

    //             this.broadcast(Struct.PackageEventChange(this, [key, ...prop], current, previous));
    //         }
    //     }
    // }



    /**
     * A helper function to package a change Event
     * @param {Struct} emitter The event emitter
     * @param {string|string[]} prop 
     * @param {*} current 
     * @param {*} previous 
     */
    static PackageEventChange(emitter, prop, current, previous) {
        let props = Array.isArray(prop) ? prop : [prop];

        return new Event("change", {
            prop: props,
            current: current,
            previous: previous
        }, emitter)
    }
    // /**
    //  * A helper function to utilize a @prop array to extract the value from the @scope with an optional short-circuit with @removeProps
    //  * @param {Struct} scope The object to traverse
    //  * @param {string[]} prop An array transformation of an object dot notation (e.g. Obj.Cat.Dog --> @prop = [ "Cat", "Dog" ], @scope = Obj)
    //  * @param {int} removeProps This will short-circuit the prop extraction (e.g. @removeProps = 1 and @prop = [ "tier1", "tier2", "tier3" ] will ignore the "tier3", and instead return @scope[ "tier1" ][ "tier2" ]);
    //  */
    // static GetBubbleProp(scope, prop, removeProps = 0) {
    //     let value = scope;

    //     prop.slice(0, prop.length - removeProps).forEach(v => {
    //         value = value[v];

    //         if (value === void 0) {
    //             return;
    //         }
    //     });

    //     return value;
    // }
};