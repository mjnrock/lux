import { GenerateUUID } from "./../../core/helper";

export default class Member {
    constructor(username, uuid = null) {
        this._uuid = uuid || GenerateUUID();

        this.User = username;

        return Object.freeze(this);
    }

    UUID() {
        return this._uuid;
    }
}