import MasterNode from "./../../node/MasterNode"
import Node from "./../../node/Node";

import Timer from "./Timer";

//!FIXME This uses the old MasterNode setup
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