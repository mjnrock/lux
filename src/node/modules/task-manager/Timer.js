import Node from "./../../Node";

export default class Timer extends Node {
    constructor() {
        super({
            StartTime: null,
            Elapsed: null,
            Duration: null,
            Sprints: [],
            _interval: null
        }, [
            "timer-start",
            "timer-stop",
            "timer-tick"
        ]);
    }

    SetTimer(duration) {
        return this.prop("Duration", duration);
    }

    StartTimer(duration = 0) {
        if(duration !== 0) {
            this.SetTimer(duration);
        }

        this.prop("StartTime", Date.now());
        this.prop("_interval", Timer.setInterval(500, 
            () => {
                this.prop("Elapsed", Date.now() - this.prop("StartTime"));
                this.emit("timer-tick", this.prop("Elapsed"));

                if(this.IsCompleted()) {
                    this.prop("_interval").cancel();
                    this.StopTimer();
                }
            }
        ));
        
        this.emit("timer-start");
        
        return this;
    }
    StopTimer() {
        this.prop("StartTime", null);
        this.aprop("Sprints", -1, Date.now() - this.prop("StartTime"));        
        
        this.emit("timer-stop");
        
        return this;
    }

    HasDuration() {
        return this.prop("Duration") > 0;
    }
    IsTimerActive() {
        return !!this.prop("StartTime");
    }
    IsCompleted() {
        if(!(this.propIsEmpty("Elapsed") && this.propIsEmpty("Duration"))) {
            return this.prop("Elapsed") >= this.prop("Duration");
        }

        return false;
    }

    
    /**
     * A replacement for setInterval() that attempts to keep drift in check.
     * The function will offset the next interval with the drift to attempt to compensate over the long run using timeouts.
     * @param {number} time 
     * @param {function} fn 
     */
    static setInterval(time, fn) {
        var cancel, nextAt, timeout, wrapper, _ref;

        nextAt = new Date().getTime() + time;
        timeout = null;

        if(typeof time === "function") {
            _ref = [ time, fn ], fn = _ref[ 0 ], time = _ref[ 1 ];
        }

        wrapper = () => {
            nextAt += time;
            timeout = setTimeout(wrapper, nextAt - new Date().getTime());

            return fn();
        };
        cancel = () => {
            return clearTimeout(timeout);
        };

        timeout = setTimeout(wrapper, nextAt - new Date().getTime());

        return {
            cancel: cancel
        };
    }
};