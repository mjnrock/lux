import Node from "./Node";
import Reaction from "./Reaction";

export default class MasterNode extends Node {
    constructor() {
        super();

        //* HIVE
        this._subordinates = {};

        this._registerModule("hive");


        //* BEHAVIOR
        this._isReactionary = false;
        this._actions = {};
        this._reactions = {};

        this._registerModule("behavior");

        this.addEvent(
            "dominate",
            "reject",
            "direct",
            "command",
            "spy",
            "action",
            "reaction"
        );
    }

    //* HIVE
    getSubordinate(name) {
        return this._subordinates[ name ];
    }
    setSubordinate(name, node) {
        if(name !== null && name !== void 0 && node !== null && node !== void 0 && arguments.length === 2) {
            this._subordinates[ name ] = node;
        }

        return this;
    }
    removeSubordinate(name) {
        delete this._subordinates[ name ];

        return this;
    }

    dominate(name, node) {
        if(name !== null && name !== void 0 && node instanceof Node && arguments.length === 2) {
            this.setSubordinate(name, node);
            node.subscribe(this);

            this.emit("dominate", name, node);
        }

        return this;
    }
    reject(name) {
        if(name !== null && name !== void 0 && arguments.length === 2) {
            this.removeSubordinate(name, node);
            node.unsubscribe(this);

            this.emit("reject", name);
        }

        return this;
    }

    node(name, node) {
        if(name !== null && name !== void 0 && arguments.length === 1) {
            return this.getSubordinate(name);
        }

        return this.dominate(name, node);
    }
    nodes(...names) {
        let nodes = [];
        for(let name of names) {
            let node = this.node(name);

            nodes.push(node);
        }

        return nodes;
    }

    getNodeName(nodeOrUUID) {
        let nodes = Object.entries(this._subordinates),
            value = nodeOrUUID;

        if(nodeOrUUID instanceof Node) {
            value = nodeOrUUID.UUID();
        }

        let [ pNode ] = nodes.filter(([ k, v ]) => v.UUID() === value);

        if(Array.isArray(pNode) && pNode.length === 2) {
            return pNode[ 0 ];
        }

        return false;
    }

    /**
     * result = @fn(node, @name)
     * 
     * @param {string} name 
     * @param {function} fn
     */
    direct(name, fn) {
        let node = this.getSubordinate(name);

        if(node instanceof Node && typeof fn === "function") {
            let result = fn(name, node);

            this.emit("direct", name, result, node.UUID());
        }

        return this;
    }
    /**
     * result = @fn(node, nodes)
     * 
     * @param {function} fn 
     */
    command(fn) {
        if(typeof fn !== "function") {
            return false;
        }

        let results = {},
            entries = Object.entries(this._subordinates);

        for(let [ name, node ] of entries) {
            if(node instanceof Node) {
                let result = fn(name, node);

                results[ name ] = [ result, node.UUID() ];
            }
        }
    
        this.emit("command", results);

        return this;
    }


    /**
     * An elevated .watch to spy on subordinates' state
     * @returns {bool} Allows determinant of success
     */
    spy(name, prop, callback) {
        let node = this.getSubordinate(name);

        if(node instanceof Node) {
            node.watch(prop, e => {
                this.emit("spy", name, e);

                callback(name, e);
            });

            return true;
        }

        return false;
    }
    /**
     * An elevated .prop for the subordinate
     * @param {string} name 
     * @param {string} prop 
     * @param {any} value 
     * @returns {<prop result>|false} Allows determinant of success
     */
    sprop(name, prop, value) {
        let node = this.getSubordinate(name);

        if(node instanceof Node) {
            return node.prop(prop, value);
        }

        return false;
    }
    /**
     * An elevated .aprop for the subordinate
     * @param {string} name 
     * @param {string} prop 
     * @param {string} key 
     * @param {any} value 
     * @returns {<prop result>|false} Allows determinant of success
     */
    saprop(name, prop, key, value) {
        let node = this.getSubordinate(name);

        if(node instanceof Node) {
            return node.aprop(prop, key, value);
        }

        return false;
    }
    /**
     * An elevated .oprop for the subordinate
     * @param {string} name 
     * @param {string} prop 
     * @param {string} key 
     * @param {any} value 
     * @returns {<prop result>|false} Allows determinant of success
     */
    soprop(name, prop, key, value) {
        let node = this.getSubordinate(name);

        if(node instanceof Node) {
            return node.oprop(prop, key, value);
        }

        return false;
    }


    //* BEHAVIOR
    hasAction(name) {
        return this._actions[ name ] !== void 0;
    }
    getAction(name) {
        return this._actions[ name ];
    }
    setAction(name, fn) {
        if(name !== null && name !== void 0 && typeof fn === "function" && arguments.length === 2) {
            this._actions[ name ] = fn;
        }
    }
    action(name, fn) {
        if(name !== null && name !== void 0 && arguments.length === 1) {
            return this.getAction(name);
        }

        return this.setAction(name, fn);
    }

    do(name, ...args) {
        if(name !== null && name !== void 0) {
            let action = this.getAction(name);

            if(typeof action === "function") {
                let result = action(...args);

                this.emit("action", name, result);
            }
        }

        return this;
    }

    hasReaction(name) {
        return this._reactions[ name ] instanceof Reaction;
    }
    getReaction(name) {
        return this._reactions[ name ];
    }
    setReaction(name, fn, cond = true) {
        if(name !== null && name !== void 0 && typeof cond === "function" && typeof fn === "function" && arguments.length === 3) {
            this._reactions[ name ] = new Reaction(name, fn, cond);
        }
        
        if(fn instanceof Reaction) {
            this._reactions[ name ] = fn;
        }

        return this;
    }
    reaction(name, fn, cond) {
        if(name !== null && name !== void 0 && arguments.length === 1) {
            return this.getReaction(name);
        }

        return this.setReaction(name, fn, cond);
    }

    react(name, ...args) {
        if(name !== null && name !== void 0) {
            let reaction = this.getReaction(name);

            if(reaction instanceof Reaction) {
                let result = reaction.run(...args);

                if(reaction === true) {
                    this.emit("reaction", name);
                }

                return result;
            }
        }
    }

    flagOnIsReactionary() {
        this._isReactionary = true;
        this.setNext(this.respond);
        
        if(!this.hasReaction("SaveState") || !this.hasProp("SubState")) {
            this.prop("SubState", {});

            this.reaction("SaveState", Reaction.createEventReaction(
                "prop-change",
                e => {
                    let name = this.getNodeName(e.getEmitter());

                    if(name) {
                        this.oprop(
                            "SubState",
                            name,
                            Object.freeze(e.getEmitter()._state)
                        );
                    }
                }
            ));
        }

        return this;
    }
    flagOffIsReactionary() {
        this._isReactionary = false;
        this.setNext(null);

        return this;
    }
    isReactionary() {
        return this._isReactionary;
    }

    respond(e) {
        if(this.isReactionary()) {
            let keys = Object.keys(this._reactions),
                responses = [];

            for(let key of keys) {
                let response = this.react(key, e);

                if(response === true) {
                    responses.push(e);
                }
            }

            return responses;
        }

        return false;
    }

    /**
     * @name supports dot-notation for deeper dives
     * @param {string|selector} name 
     */
    getSubState(name) {
        if(name === void 0) {
            return this.prop("SubState");
        }

        return this.oprop("SubState", name);
    }
};