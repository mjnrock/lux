import AControl from "./AControl";

export default class ActiveControl extends AControl {
    constructor(name) {
        super(name);

        this.prop("IsActive", false);

        this.addEvent(
            "activate",
            "deactivate"
        );
    }
    
    Toggle() {
        if(this.IsActive()) {
            this.Deactivate();
        } else {
            this.Activate();
        }

        return this;
    }
    Activate() {
        this.prop("IsActive", true);

        this.emit("activate");

        return this;
    }
    Deactivate() {
        this.prop("IsActive", false);

        this.emit("deactivate");

        return this;
    }

    IsActive() {
        return this.prop("IsActive");
    }
};