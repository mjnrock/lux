import Node from "./Node";

export default class MasterNode extends Node {
    constructor() {
        super();

        //* LINEAGE        
        this._children = {};        // Children Nodes for create Node clusters (will un/subscribe to child on .adopt()/.abandon())
        this._parent = null;        // A convenience reference to the Node's parent

        this._registerModule("lineage");
    }


    //* LINEAGE
    adopt(child) {
        if(child instanceof Node) {
            this._children[ child.UUID() ] = child;
            
            this.subscribe(child);

            child.setParent(this);
        }

        return this;
    }
    abandon(childOrUUID) {
        if(childOrUUID instanceof Node) {
            delete this._children[ child.UUID() ];
            
            this.unsubscribe(childOrUUID);
            
            child.setParent(null);
        } else if(typeof childOrUUID === "string" || childOrUUID instanceof String) {
            delete this._children[ childOrUUID ];
            
            this.unsubscribe(childOrUUID);
        }

        return this;
    }

    getChild(uuid) {
        return this._children[ uuid ];
    }
    setChild(uuid, child) {
        this._children[ uuid ] = child;

        return this;
    }

    getParent() {
        return this._parent;
    }
    setParent(value) {
        this._parent = value;

        return this;
    }

    child(uuid, child) {
        if(child === void 0) {
            return this.getChild(uuid);
        }
        
        return this.setChild(uuid, child);
    }
    parent(value) {
        if(value === void 0) {
            return this.getParent();
        }
        
        return this.setParent(value);
    }
};