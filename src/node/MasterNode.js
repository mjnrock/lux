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
            "manipulated"
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
        this.link(node);

        this.emit("dominate", name, node);

        return this;
    }
    reject(name) {
        this.removeSubordinate(name, node);
        this.unlink(node);

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

    manipulate(name, fn) {
        let node = this.getSubordinate(name);

        if(node instanceof Node && typeof fn === "function") {
            let result = fn(node, name, this);

            this.emit("manipulated", result, node, name);
        }

        return this;
    }
};