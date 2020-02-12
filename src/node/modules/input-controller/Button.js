import ActiveControl from "./ActiveControl";

export default class Button extends ActiveControl {
    constructor(name) {
        super(name);

        //TODO ALlow for sequential events (e.g. Click, Double Click, Hold, etc.)
    }
};