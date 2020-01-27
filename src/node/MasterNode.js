import Node from "./Node";

export default class MasterNode extends Node {
    constructor() {
        super();

        //* HIVE
        this._subordinates = {};

        this._registerModule("hive");

        this.addEvent(
            "dominate",
            "reject",
            "direct",
            "command"
        )
    }

    getSubordinate(name) {
        return this._subordinates[ name ];
    }
    setSubordinate(name, node) {
        this._subordinates[ name ] = node;

        return this;
    }
    removeSubordinate(name) {
        delete this._subordinates[ name ];

        return this;
    }

    dominate(name, node) {
        this.setSubordinate(name, node);
        node.subscribe(this);

        this.emit("dominate", name, node);

        return this;
    }
    reject(name) {
        this.removeSubordinate(name, node);
        node.unsubscribe(this);

        this.emit("reject", name);

        return this;
    }

    node(name, node) {
        if(node === void 0) {
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

    /**
     * result = @fn(node, @name)
     * 
     * @param {string} name 
     * @param {function} fn
     */
    direct(name, fn) {
        let node = this.getSubordinate(name);

        if(node instanceof Node && typeof fn === "function") {
            let result = fn(node, name);

            this.emit("direct", result, node.UUID(), name);
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
            nodes = Object.values(this._subordinates);

        for(let node of nodes) {
            if(node instanceof Node) {
                let result = fn(node, nodes);

                results[ node.UUID() ] = result;
            }
        }
    
        this.emit("command", results);

        return this;
    }
};