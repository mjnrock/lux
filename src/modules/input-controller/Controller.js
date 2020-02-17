import AControl from "./AControl";
import ActiveControl from "./ActiveControl";
import ButtonGroup from "./ButtonGroup";
import DPad from "./DPad";

export default class Controller extends AControl {
    constructor(name, controls = []) {
        super(name);

        this.prop("Controls", {});

        this.addEvent(
            "control-event",
            "sub-controller-event"
        );

        this.SetControls(controls);
    }

    Get(nameOrUUID) {
        let Controls = this.prop("Controls");

        if(Controls[ nameOrUUID ]) {
            return Controls[ nameOrUUID ];
        }

        for(let uuid in Controls) {
            if(Controls[ uuid ].prop("Name") === nameOrUUID) {
                return Controls[ uuid ];
            }
        }

        return false;
    }
    GetControls() {
        let obj = {},
            Controls = this.prop("Controls");

        for(let uuid in Controls) {
            obj[ Controls[ uuid ].prop("Name") ] = Controls[ uuid ];
        }

        return obj;
    }

    //! This was VERY quickly moved to the new model, needs thorough testing...
    SetControls(controls) {
        let Controls = {},
            controlEventCaller = (e) => {
                e.addEmitter(this);
                this.emit("control-event", e)
            },
            subControlEventCaller = (e) => {
                e.addEmitter(this);
                this.emit("sub-control-event", e)
            };

        //TODO This should be abstracted to a generalized "SubscribeALl" function, that should go through ALL children and descendents
        for(let control of controls) {
            if(control instanceof AControl) {
                Controls[ control.UUID() ] = control;
    
                if(control instanceof ActiveControl) {
                    control.listen("activate", controlEventCaller);
                    control.listen("deactivate", controlEventCaller);
                }

                if(control instanceof ButtonGroup) {
                    control.listen("bitmask-update", controlEventCaller);

                    for(let btn of control.prop("Buttons")) {
                        btn.listen("activate", controlEventCaller);
                        btn.listen("deactivate", controlEventCaller);
                    }
                }

                if(control instanceof Controller) {
                    control.listen("control-event", controlEventCaller);
                    //? Special event to route all "control-event" (again) and make it easier to puppet sub-controllers
                    control.listen("control-event", subControlEventCaller);

                    //TODO Subscribe to ALL Controller's children, including ALL descendency
                }
            }
        }

        if(Object.entries(Controls).length !== 0) {
            this.prop("Controls", Controls);
        }
    }
};