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
            "command",
            "spy"
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
     * An elevated .watch to spy on subordinates' props
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
};