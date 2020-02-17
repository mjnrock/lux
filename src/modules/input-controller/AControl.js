import Node from "./../../node/Node";

export default class AControl extends Node {
    constructor(name) {
        super();

        this.prop("Name", name);

        this._registerModule("input-controller");
    }
};