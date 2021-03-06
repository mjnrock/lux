import { GenerateUUID } from "./../core/helper";

import Struct from "./Struct";
import Event from "./Event";
import Reaction from "./Reaction";

export default class Observer {
    constructor(subject, onNext = null) {
        this._uuid = GenerateUUID();

        this._subject = null;
        this._registry = {};
        this._next = null;    //? Consider this a root reducer | If typeof this._next === "function", EVERY event will invoke it (even if there is ALSO a reaction)

        this._reactions = {};   //? Consider this an event-specific reducer | This allows for event-specific handling (Note: ALL events will ALWAYS be passed to this._next, iff this._next is a function)

        this.init(subject, onNext);
    }

    /**
     * Alias exposure for this._uuid
     */
    UUID() {
        return this._uuid;
    }

    init(subject, onNext = null) {
        if(subject && !(subject instanceof Struct)) {
            throw new Error("[Invalid Type]: Observer can only accept <Struct> objects");
        }

        this._registry = {};
        this._reactions = {};

        this.setSubject(subject);
        this.setNext(onNext);

        return this;
    }

    $(prop, ...args) {
        if(!this._subject) {
            return;
        }

        if(prop) {
            if(typeof this._subject[ prop ] === "function") {
                return this._subject[ prop ](...args);
            }

            return this._subject[ prop ];
        }

        return this._subject;
    }

    getSubject() {
        return this._subject;
    }
    setSubject(subject) {
        this._subject = subject;

        this.register(this._subject);
        this.analyze(this._subject);

        return this;
    }

    setNext(onNext) {
        this._next = onNext;

        return this;
    }

    analyze(obj) {
        if(!obj || (Object.entries(obj).length === 0 && obj.constructor === Object)) {
            return;
        }
        
        if(obj instanceof Struct) {
            this.register(obj);
            
            this.analyze(obj._state);
        } else {
            Object.values(obj).forEach(value => {
                if(typeof value === "object" || Array.isArray(value)) {
                    this.analyze(value);
                }
            });
        }

        return this;
    }

    register(struct) {
        if(struct instanceof Struct) {
            if(!this._registry[ struct.UUID() ]) {
                struct.subscribe(this);
    
                this._registry[ struct.UUID() ] = struct;
            }
        }

        return this;
    }
    unregister(struct) {
        if(struct instanceof Struct) {
            struct.unsubscribe(this);

            delete this._registry[ struct.UUID() ];
        }

        return this;
    }

    next(e) {
        if(e instanceof Event) {
            let reactions = this.getReactions(e.getType());

            if(Array.isArray(reactions)) {
                for(let reaction of reactions) {
                    reaction.run(e);
                }
            }

            if(typeof this._next === "function") {
                return this._next(e);
            }
        }

        return;
    }

    getReactions(eventType, toArray = true) {
        let ret = this._reactions[ eventType ];

        if(ret && toArray) {
            return Array.from(ret);
        }

        return ret;
    }
    
    addReaction(eventType, callback) {
        if(typeof callback === "function") {
            if(!(this._reactions[ eventType ] instanceof Set)) {
                this._reactions[ eventType ] = new Set();
            }

            let reaction = Reaction.createEventReaction(eventType, callback);

            this._reactions[ eventType ].add(reaction);
        }

        return this;
    }
};