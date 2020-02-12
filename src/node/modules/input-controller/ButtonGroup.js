import Helper from "./../../../core/helper";

import AControl from "./AControl";
import Button from "./Button";

//? Any easy subscribale/tidier for a given group of buttons with "IsActive" status awareness
export default class ButtonGroup extends AControl {
    constructor(name, buttons = []) {
        super(name);

        this.prop("Bitmask", 0);
        this.prop("Buttons", []);

        this.addEvent(
            "bitmask-update"
        );

        this.SetButtons(buttons);
    }

    SetButtons(btns) {
        let buttons = [];

        for(let i in btns) {
            let btn = btns[ i ];

            // If the input is a "string" or "number", assume it is the @name and instantiate Button
            if(typeof btn === "string" || btn instanceof String || typeof btn === "number") {
                btn = new Button(btn.toString());
            }

            if(btn instanceof Button) {
                buttons.push(btn);
    
                btn.listen("activate", () => this.OnButtonActivate(btn, i));
                btn.listen("deactivate", () => this.OnButtonDeactivate(btn, i));
            }
        }
        
        this.prop("Buttons", buttons);
    }

    safetyWrapper(index) {
        index = +index;
        
        if(index >= 0 && index < this.prop("Buttons").length) {
            return true;
        } else {
            throw new Error(`[Invalid Index]: "${ index }" does not exist`);
        }
    }

    Get(indexOrName) {
        if(typeof indexOrName === "number") {
            if(this.safetyWrapper(indexOrName)) {
                return this.aprop("Buttons", +indexOrName);
            }
        } else if(typeof indexOrName === "string" || indexOrName instanceof String) {
            let filtered = this.prop("Buttons").filter(b => b.prop("Name") === indexOrName);
    
            if(filtered.length) {
                return filtered[ 0 ];
            }
        }

        return false;
    }
    GetName(index) {
        if(this.safetyWrapper(index)) {
            return this.aprop("Buttons", +index).prop("Name");
        }

        return false;
    }
    GetIndex(name) {
        for(let i in this.prop("Buttons")) {
            if(this.prop("Buttons", +i).prop("Name") === name) {
                return i;
            }
        }

        return false;
    }

    /**
     *  returns {
     *      name: [ index, name, Button ],
     *      ...
     *  }
     */
    GetMapping() {
        let obj = {};

        this.prop("Buttons").forEach((b, i) => {
            obj[ b.prop("Name") ] = [ i, b.prop("Name"), b ];
        });

        return obj;
    }

    // @mask === true ? Activate() : Deactivate()
    maskButton(index, mask) {
        if(this.safetyWrapper(index)) {
            if(mask) {
                this.Activate(index);
            } else {
                this.Deactivate(index);
            }
        }

        return this;
    }

    Toggle(index) {
        if(this.safetyWrapper(index)) {
            this.prop("Buttons", +index).Toggle();
        }

        return this;
    }
    Activate(index) {
        if(this.safetyWrapper(index)) {
            this.prop("Buttons", +index).Activate();
        }

        return this;
    }
    Deactivate(index) {
        if(this.safetyWrapper(index)) {
            this.prop("Buttons", +index).Deactivate();
        }

        return this;
    }
    IsActive(index) {
        if(this.safetyWrapper(index)) {
            this.prop("Buttons", +index).IsActive();
        }

        return this;
    }

    //TODO Basic idea, add the actual bitmask changing
    OnButtonActivate(button, index) {
        let mask = Helper.Bitmask.Add(this.prop("Bitmask"), 2 << +index);
        
        this.prop("Bitmask", mask);
        
        this.emit("bitmask-update", mask, +index, 2 << +index);
    }
    OnButtonDeactivate(button, index) {
        let mask = Helper.Bitmask.Remove(this.prop("Bitmask"), 2 << +index);
        
        this.prop("Bitmask", mask);
        
        this.emit("bitmask-update", mask, +index, 2 << +index);
    }
};