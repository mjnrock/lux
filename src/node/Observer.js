import Struct from "./Struct";
import Event from "./Event";
import Reaction from "./Reaction";

export default class Observer {
    constructor(subject, onNext = null) {
        this._subject = null;
        this._registry = {};
        this._next = null;    //? Consider this a root reducer | If typeof this._next === "function", EVERY event will invoke it (even if there is ALSO a reaction)

        this._reactions = {};   //? Consider this an event-specific reducer | This allows for event-specific handling (Note: ALL events will ALWAYS be passed to this._next, iff this._next is a function)

        this.init(subject, onNext);
    }

    init(subject, onNext = null) {
        if(subject && !(subject instanceof Struct)) {
            throw new Error("[Invalid Type]: Observer can only accept <Struct> objects");
        }

        this._registry = {};
        this._reactions = {};

        this.setSubject(subject);
        this.setNext(onNext);
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

    //TODO Test that the recursion works in general and for deeply-nested objects
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





        // Object.values(obj).forEach(value => {
        //     if(value instanceof Struct) {
        //         this.register(value);

        //         this.analyze(value._state);
        //     }
        //     // else if(typeof value === "object" || Array.isArray(value)) {
        //     //     for(let i in value) {
        //     //         this.analyze(value[ i ]);
        //     //     }
        //     // }
        // });

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

    getReactions(type, toArray = true) {
        let ret = this._reactions[ type ];

        if(ret && toArray) {
            return Array.from(ret);
        }

        return ret;
    }
    
    addReaction(type, callback) {
        if(typeof callback === "function") {
            if(!Array.isArray(this._reactions[ type ])) {
                this._reactions[ type ] = new Set();
            }

            let reaction = Reaction.createEventReaction(type, callback);

            this._reactions[ type ].add(reaction);
        }
    }
};