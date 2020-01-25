import ButtonGroup from "./ButtonGroup";

export default class DPad extends ButtonGroup {
    constructor(name) {
        super(name, [
            `up`,
            `down`,
            `left`,
            `right`,
        ]);
    }

    Up(mask = false) {
        return this.maskButton(0, mask);
    }
    Down(mask = false) {
        return this.maskButton(1, mask);
    }
    Left(mask = false) {
        return this.maskButton(2, mask);
    }
    Right(mask = false) {
        return this.maskButton(3, mask);
    }
};