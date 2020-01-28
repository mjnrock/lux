import Controller from "./Controller";
import Node from "./../Node";

//! This has not bee remodified AT ALL
export default class MultiController extends Node {
    constructor(controllers = []) {
        super();

        this.prop("Controllers", {});
        
        //? Throttle event firing, mainly to be used for "user-events", but could be expanded if abstracted into throttled call
        this.prop("Throttle", { // in milliseconds (e.g. 15 = 15ms)
            "user-event": {
                "keydown": 50,
                "keyup": 50,

                "mousedown": 50,
                "mouseup": 50,
                "click": 50,
                "dblclick": 50,
                "mousemove": 50
            }
        });
        this.prop("Log", { // Last time that event was called
            "user-event": {
                "keydown": 0,
                "keyup": 0,

                "mousedown": 0,
                "mouseup": 0,
                "click": 0,
                "dblclick": 0,
                "mousemove": 0
            }
        });

        this.on("controller-event");
        this.on("user-event");

        if(controllers.length) {
            this.SetControllers(controllers);
        }

        //! These are commented for DEBUGGING reasons only, so as not to pollute `console.log`
        //? Once the Handler has been finalized, this won't have to result in that console logging
        this.AttemptHTMLBindings([
            "onkeydown",
            "onkeyup",
            // "onkeypress",

            // "onmousedown",
            // "onmouseup",
            // "onmousemove",
            "onclick",
            "ondblclick",
        ]);

        this._registerModule("input-controller");
    }

    AttemptHTMLBindings(bindings = [
        "onkeypress",
        "onclick",
        "ondblclick"
    ]) {
        if(window) {
            let keyListener = (e) => {
                    let now = Date.now(),
                        Throttle = this.prop("Throttle"),
                        Log = this.prop("Log"),
                        evt = "user-event";

                    if(now - Throttle[ evt ][ e.type ] >= Log[ evt ][ e.type ]) {
                        this.call(evt, [
                            e.type,
                            e.which,
                            e
                        ]);
                        
                        Log[ evt ][ e.type ] = now;
                        this.prop("Log", Log);
                    }
                },
                mouseListener = (e) => {
                    let now = Date.now(),
                        Throttle = this.prop("Throttle"),
                        Log = this.prop("Log"),
                        evt = "user-event";

                    if(now - Throttle[ evt ][ e.type ] >= Log[ evt ][ e.type ]) {
                        this.call(evt, [
                            e.type,
                            [ e.clientX, e.clientY, "client" ],
                            [ e.screenX, e.screenY, "screen" ],
                            e
                        ]);
                        
                        Log[ evt ][ e.type ] = now;
                        this.prop("Log", Log);
                    }
                }

            for(let event of bindings) {
                if(event.includes("key")) {
                    window[ event ] = (e) => keyListener(e);
                } else {
                    window[ event ] = (e) => mouseListener(e);
                }
            }
        }
    }

    Get(nameOrUUID) {
        let Controllers = this.prop("Controllers");

        if(Controllers[ nameOrUUID ]) {
            return Controllers[ nameOrUUID ];
        }

        for(let uuid in Controllers) {
            if(Controllers[ uuid ].prop("Name") === nameOrUUID) {
                return Controllers[ uuid ];
            }
        }

        return false;
    }
    GetControllers() {
        let obj = {},
            Controllers = this.prop("Controllers");

        for(let uuid in Controllers) {
            obj[ Controllers[ uuid ].prop("Name") ] = Controllers[ uuid ].GetControls();
        }

        return obj;
    }

    SetControllers(...controllers) {
        let Controllers = {};

        for(let controller of controllers) {
            if(controller instanceof Controller) {
                Controllers[ controller.UUID() ] = controller;

                controller.listen("control-event", ([ controller, event, control], [ controllerEvent ]) => {
                    this.call("controller-event", [ event, control, controller, controllerEvent ]);
                });
                //* Not subscribing because it will double capture without a second handler, and really not necessary here at this time
                // controller.listen("sub-controller-event", () => this.call("controller-event"));
            }
        }

        if(Object.entries(Controllers).length !== 0) {
            this.prop("Controllers", Controllers);
        }
    }
};