import { GenerateUUID } from "../core/helper";
import Observer from "./Observer";

export default class Node extends Observer {
    constructor(subject, { next = null } = {}) {
        super(subject, next);

        this._ids = {};
        this._subscriptions = {};

        return new Proxy(this, {
            get: (obj, prop) => {
                if(typeof obj[ prop ] === "function") {     // function access priority in case of this._subject collisions
                    return obj[ prop ];
                } else if(obj._subject && obj._subject[ prop ] !== void 0) {
                    return obj._subject[ prop ];
                }

                return obj[ prop ];
            }
        });
    }

    UUID(uuid = null) {
        if(uuid === true) {
            this._uuid = GenerateUUID();
        } else if(uuid !== null && uuid !== void 0) {
            let regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/, "i");

            if(regex.test(uuid)) {
                this._uuid = uuid;
            } else {
                throw new Error("[Invalid UUID]: @uuid is did not pass a UUID RegEx check.  Invoke 'this.UUID(true)' to auto-generate.");
            }
        } else {
            return this._uuid;
        }

        return this;
    }

    getID(scope) {
        if(this._ids[ scope ] !== void 0) {
            return this._ids[ scope ];
        }

        return this._ids;
    }
    setID(scope, id) {
        if(scope !== null && scope !== void 0 && id !== null && id !== void 0 && arguments.length === 2) {
            this._ids[ scope ] = id;
        }

        return this;
    }

    addLink(node) {
        if(node instanceof Node) {
            this.subscribe(node);
            node.subscribe(this);
        }

        return this;
    }
    removeLink(node) {
        if(node instanceof Node) {
            this.unsubscribe(node);
            node.unsubscribe(this);
        }

        return this;
    }

    subscribe(nodeNextOrFn) {
        let uuid,
            sub;

        if (nodeNextOrFn instanceof Node) {
            sub = new Subscription(nodeNextOrFn, this);
            uuid = sub.UUID();
        } else if (typeof nodeNextOrFn === "function" || typeof nodeNextOrFn.next === "function") {
            sub = nodeNextOrFn;
            uuid = GenerateUUID();
        }

        if (uuid) {
            this._subscriptions[uuid] = sub;

            return uuid;
        }

        return false;
    }
};