import Node from "./../Node";

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
        this.prop("_interval", setInterval(
            () => {
                this.prop("Elapsed", Date.now() - this.prop("StartTime"));
                this.emit("timer-tick", this.prop("Elapsed"));

                if(this.IsCompleted()) {
                    clearInterval(this.prop("_interval"));
                    this.StopTimer();
                }
            },
            500
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
};