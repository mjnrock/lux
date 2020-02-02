import Node from "./Node";
import Reaction from "./Reaction";
import Event from "./Event";
import { GenerateUUID } from "../core/helper";

export default class MasterNode extends Node {
    constructor(state = {}, events = []) {
        super(state, events = []);
        
        this._subordinates = {};

        this.addEvent(
            "attach"
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
        if((typeof name === "string" || name instanceof String) && node instanceof Node) {
            this.setSubordinate(name, node);
            this.subscribeTo(node);

            this.emit("attach", name, node);
        }

        return this;
    }
    detach(name) {
        let sub = this.getSubordinate(name);

        if(sub instanceof Node) {
            this.removeSubordinate(name);
            this
        }
    }
};