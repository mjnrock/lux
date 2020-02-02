import Node from "./Node";
import Reaction from "./Reaction";
import Event from "./Event";
import { GenerateUUID } from "../core/helper";

export default class MasterNode extends Node {
    constructor(state = {}, events = []) {
        super(state, events = []);
        
        this._subordinates = {};

        this.addEvent(
            "attach",
            "detach"
        );
    }

    getSubordinate(name) {
        if(name) {
            return this._subordinates[ name ];
        }

        return this._subordinates;
    }
    setSubordinate(name, nodeOrState, events = []) {
        if(name) {
            if(nodeOrState instanceof Node) {
                this._subordinates[ name ] = nodeOrState;
            } else if(typeof nodeOrState === "object") {
                this._subordinates[ name ] = new Node(nodeOrState, events);
            } else {
                this._subordinates[ name ] = new Node();
            }
        }

        return this;
    }
    removeSubordinate(name) {
        delete this._subordinates[ name ];

        return this;
    }

    attach(name, node) {
        if(arguments.length === 1 && name instanceof Node) {
            node = name;
            name = node.UUID();
        }

        if((typeof name === "string" || name instanceof String) && node instanceof Node) {
            this.setSubordinate(name, node);
            this.subscribeTo(node);

            this.emit("attach", name, node);
        }

        return this;
    }
    detach(nameOrNode) {
        let name, node;

        if(typeof nameOrNode === "string" || nameOrNode instanceof String) {
            name = nameOrNode;
            node = this.getSubordinate(name);
        } else if(nameOrNode instanceof Node) {
            name = nameOrNode.UUID();
            node = nameOrNode;
        }

        if(this.getSubordinate(name)) {
            this.removeSubordinate(name);
            this.unsubscribeTo(node);

            this.emit("detach", name, node);
        }

        return this;
    }
};