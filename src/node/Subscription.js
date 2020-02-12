import { GenerateUUID } from "./../core/helper";
import Node from "./Node";
import Struct from "./$Struct";

export default class Subscription {
    constructor(subscribor, subscribee) {
        if(!(subscribor instanceof Node) || !(subscribee instanceof Node || subscribee instanceof Struct)) {
            throw new Error("Subscriptions only accept <Node> parameters");
        }

        this._uuid = GenerateUUID();
        this._subscribor = subscribor;
        this._subscribee = subscribee;

        return Object.freeze(this);
    }

    UUID() {
        return this._uuid;
    }

    getSubscribor() {
        return this._subscribor;
    }
    getSubscribee() {
        return this._subscribee;
    }

    isSubscribor(obj, comparator = -1) {
        if(comparator === -1 && (typeof obj === "string" || obj instanceof String)) {
            let uuid = this._subscribor._uuid || false;

            if(uuid) {
                return uuid === obj;
            }
        } else if(typeof comparator === "function") {
            return comparator(obj) === true;
        }

        return false;
    }
    isSubscribee(obj, comparator = -1) {
        if(comparator === -1 && (typeof obj === "string" || obj instanceof String)) {
            let uuid = this._subscribee._uuid || false;

            if(uuid) {
                return uuid === obj;
            }
        } else if(typeof comparator === "function") {
            return comparator(obj) === true;
        }

        return false;
    }
};