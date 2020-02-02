import Node from "./Node";
import Reaction from "./Reaction";
import Event from "./Event";
import { GenerateUUID } from "../core/helper";

export default class MasterNode extends Node {
    constructor(state = {}, events = []) {
        super(state, events = []);
        
        this.prop("_subState", {});

        this._entities = {};
        this._reactions = {};       // These are reactions to <Event>s passed into .next() and packaged into <Reaction> classes; they are event-specific if used with .addReactionEvent()
        this._responses = [];       // These are meant to work like reducers in React, with their invocation initiated by a .next() call that does not pass an <Event>; if it will, use _reactions

        this.addEvent(
            "attach",
            "detach",
            "substate-change"
        );

        this.setNext(this.react);
        this.addReactionEvent(
            "prop-change",
            "prop-change::array",
            "prop-change::object",
        )
    }

    $(name) {
        if(name) {
            return this.oprop("_subState", name);
        }

        return this.prop("_subState");
    }
    findEntityName(uuid) {
        for(let [ name, entity ] of Object.entries(this._entities)) {
            if(entity.UUID() === uuid) {
                return name;
            }
        }
    }



    hasEntity(nameOrUUID) {
        let ent = this.getEntity(nameOrUUID);

        if(ent instanceof Node) {
            return true;
        }

        for(let entity of Object.values(this._entities)) {
            if(entity.UUID() === nameOrUUID) {
                return true;
            }
        }

        return false;
    }
    getEntity(nameOrUUID) {
        let ent = this._entities [ nameOrUUID ];

        if(ent instanceof Node) {
            return ent;
        }

        for(let entity of Object.values(this._entities)) {
            if(entity.UUID() === nameOrUUID) {
                return entity;
            }
        }

        return this._entities;
    }
    setEntity(name, nodeOrState, events = []) {
        if(name) {
            if(nodeOrState instanceof Node) {
                this._entities[ name ] = nodeOrState;
            } else if(typeof nodeOrState === "object") {
                this._entities[ name ] = new Node(nodeOrState, events);
            } else {
                this._entities[ name ] = new Node();
            }
        }

        return this;
    }
    removeEntity(name) {
        delete this._entities[ name ];

        return this;
    }

    attach(name, node) {
        if(arguments.length === 1 && name instanceof Node) {
            node = name;
            name = node.UUID();
        }

        if((typeof name === "string" || name instanceof String) && node instanceof Node) {
            this.setEntity(name, node);
            this.subscribeTo(node);

            this.emit("attach", name, node);
        }

        return this;
    }
    detach(nameOrNode) {
        let name, node;

        if(typeof nameOrNode === "string" || nameOrNode instanceof String) {
            name = nameOrNode;
            node = this.getEntity(name);
        } else if(nameOrNode instanceof Node) {
            name = nameOrNode.UUID();
            node = nameOrNode;
        }

        if(this.getEntity(name)) {
            this.removeEntity(name);
            this.unsubscribeTo(node);

            this.emit("detach", name, node);
        }

        return this;
    }



    getReaction(name) {
        if(name) {
            return this._reactions[ name ];
        }

        return this._reactions;
    }
    setReaction(name, reaction) {
        if(arguments.length === 1) {
            reaction = name;

            if(name instanceof Reaction) {
                name = reaction.getName() || reaction.UUID();
            } else if(typeof name === "function") {
                name = GenerateUUID();
            } 
        }

        if(reaction instanceof Reaction) {
            this._reactions[ name ] = reaction;
        } else if(typeof reaction === "function") {
            this.setReaction(
                name,
                new Reaction(name, reaction)
            );
        }

        return this;
    }
    removeReaction(name) {
        delete this._reactions[ name ];

        return this;
    }

    addReactionEvent(...events) {
        let fn = e => {        
            if(e instanceof Event && (e.getType() === "prop-change" || e.getType() === "prop-change::array" || e.getType() === "prop-change::object")) {
                let emitter = e.getEmitter(),
                    name = this.findEntityName(emitter.UUID());

                    if(name) {
                        let newValue = Object.freeze(JSON.parse(JSON.stringify(emitter._state))),
                            oldValue = this.oprop("_subState", name);

                        this.oprop("_subState", name, newValue);

                        let obj = {
                            name: name,
                            current: newValue,
                            previous: oldValue
                        };

                        this.emit("substate-change", obj);

                        return obj;
                    }
            }
        };

        for(let name of events) {
            if(typeof name === "string" || name instanceof String) {
                let reaction = Reaction.createEventReaction(
                        name,
                        fn.bind(this)
                    );

                this.setReaction(name, reaction);
            }
        }

        return this;
    }

    /**
     * Functionally, this thing will "catch" all <Event>s emitted by an attached <Node> via the this.next(this.react) chain.
     * @param {*} e 
     */
    react(e) {
        if(e instanceof Event) {
            let reaction = this.getReaction(e.getType());

            if(reaction instanceof Reaction) {
                reaction.run(e);
            }
        } else {
            this.respond(...arguments);
        }

        return e;
    }

    getResponse(index) {
        if(index === void 0) {
            return this._responses;
        }

        return this._responses[ index ];
    }
    addResponse(response) {
        if(typeof response === "function") {
            this._responses.push(response);
        }

        return this;
    }
    deleteResponse(index) {
        if(typeof index === "number" && index >= 0) {
            return this._responses.splice(index, 1);
        }
    }

    respond(...args) {
        for(let response of this._responses) {
            if(typeof response === "function") {
                response(...args);
            }
        }

        return this;
    }
};