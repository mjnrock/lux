import MasterNode from "../MasterNode";
import Node from "../Node";

import Timer from "./Timer";

export default class Task extends MasterNode {
    constructor(content) {
        super({
            Content: content
        });

        this.load("Timer", new Timer());

        this.flagOnIsReactionStateSave();
        this.flagOnIsReactionary();
        this.eventReactionReemit(
            "timer-start",
            "timer-stop",
            "timer-tick"
        );
    }
};