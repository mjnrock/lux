import { GenerateUUID } from "./../core/helper";
import Event from "./Event";

export default class Reaction {
    constructor(name, resp, cond = true) {
        this._uuid = GenerateUUID();

        this._name = name;
        this._condition = cond;
        this._response = resp;
    }

    UUID() {
        return this._uuid;
    }

    getName() {
        return this._name;
    }
    getCondition() {
        return this._condition
    }
    getResponse() {
        return this._response;
    }

    run(...args) {
        let cond = this.getCondition();

        let shouldProceed = false;
        if(typeof cond === "function") {
            shouldProceed = cond(...args);
        } else if(cond === true) {
            shouldProceed = true;
        }

        if(shouldProceed === true) {
            let resp = this.getResponse();

            if(typeof resp === "function") {
                resp(...args);
            }
        }

        return shouldProceed;
    }

    static createEventReaction(name, eventType, resp) {
        if(arguments.length === 2 && typeof eventType === "function") {
            resp = eventType;
            eventType = name;
        }

        return new Reaction(name, resp, e => {
            if(e instanceof Event && e.getType() === eventType) {
                return true;
            }

            return false;
        });
    }
}