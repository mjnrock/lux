import Node from "./../Node";

export default class Timer extends Node {
    constructor() {
        super({
            StartTime: null,
            Elapsed: null,
            Duration: null,
            Sprints: []
        }, [
            "timer-start",
            "timer-stop"
        ]);
    }

    SetTimer(duration) {
        return this.prop("Duration", duration);
    }

    StartTimer(duration = 0) {
        if(duration !== 0) {
            this.SetTimer(duration);
        }

        this.prop("IsRunning", true);
        this.prop("StartTime", Date.now());
        
        this.emit("timer-start");
        
        return this;
    }
    StopTimer() {
        this.prop("IsRunning", false);
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
};