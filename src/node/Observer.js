import Struct from "./Struct";
import Event from "./Event";
import Reaction from "./Reaction";

export default class Observer {
    constructor(subject, onNext = null) {
        if(!(subject instanceof Struct) && !(subject instanceof Node)) {
            throw new Error("[Invalid Type]: Observer can only accept <Struct|Node> objects");
        }

        this._subject = subject;
        this._registry = {};
        this._next = onNext;    //? Consider this a root reducer | If typeof this._next === "function", EVERY event will invoke it (even if there is ALSO a reaction)

        this._reactions = {};   //? Consider this an event-specific reducer | This allows for event-specific handling (Note: ALL events will ALWAYS be passed to this._next, iff this._next is a function)

        this.analyze(this._subject);
    }

    //TODO Test that the recursion works in general and for deeply-nested objects
    analyze(obj) {
        Object.keys(obj).forEach(key => {
            if(obj instanceof Struct || obj instanceof Node) {
                this.register(obj[ key ]);
                
                this.analyze(obj[ key ]);
            } else if(typeof obj[ key ] === "object") {
                this.analyze(obj[ key ]);
            } else if(Array.isArray(obj[ key ])) {
                for(let entry of obj[ key ]) {
                    this.analyze(entry);
                }
            }
        });

        return this;
    }

    register(input) {
        if(input instanceof Struct || input instanceof Node) {
            input.subscribe(this);

            this._registry[ input.UUID() ] = input;
        }

        return this;
    }
    unregister(input) {
        if(input instanceof Struct || input instanceof Node) {
            input.unsubscribe(this);

            delete this._registry[ input.UUID() ];
        }

        return this;
    }

    next(e) {
        if(e instanceof Event) {
            for(let type in this._reactions) {
                this._reactions[ type ].run(e);
            }

            if(typeof this._next === "function") {
                return this._next(e);
            }
        }

        return;
    }

    getReaction(type) {
        if(type) {
            return this._reactions[ type ];
        }

        return this._reactions;
    }
    setReaction(type, callback) {
        if(typeof callback === "function") {
            let reaction = Reaction.createEventReaction(type, callback);

            this._reactions[ type ] = reaction;
        }
    }
    removeReaction(type) {
        delete this._reactions[ type ];

        return this;
    }
};