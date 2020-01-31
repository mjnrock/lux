import MasterNode from "../MasterNode";
import Node from "../Node";

import Timer from "./Timer";

export default class Task extends MasterNode {
    constructor(content) {
        super({
            Content: content
        });

        this.load("Timer", new Timer());

        this.flagOnIsReactionary();
        this.flagOnIsReactionStateSave();
        this.eventReactionReemit(
            "timer-start",
            "timer-stop"
        );
    }
};