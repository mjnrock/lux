import Node from "./../Node";

export default class AControl extends Node {
    constructor(name) {
        super();

        this.prop("Name", name);
    }
};