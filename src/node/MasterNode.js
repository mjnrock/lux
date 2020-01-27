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
        node.ID(this.UUID(), name);

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

    getNodeID(input) {
        let node;

        if(input instanceof Node) {
            node = input;
        } else if(typeof input === "string" || input instanceof String) {
            let pNode = Object.values(this._subordinates).filter(n => n.UUID() === input);

            if(Array.isArray(pNode) && pNode.length === 1) {
                node = pNode[ 0 ];
            }
        } else {
            return false;
        }

        return node.getID(this.UUID());
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
            nodes = Object.values(this._subordinates);

        for(let node of nodes) {
            if(node instanceof Node) {
                let result = fn(node, nodes);

                results[ node.ID(this.UUID()) ] = result;
            }
        }
    
        this.emit("command", results);

        return this;
    }
};