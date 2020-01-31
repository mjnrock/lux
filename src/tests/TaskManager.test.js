import TaskManager from "./../node/task-manager/package";

export function RunTest() {
    let task = new TaskManager.Task("Cats!");

    // task.listen("timer-start", console.log);
    task.node("Timer").listen("timer-tick", e => console.log(e.getEmitter(0).IsCompleted()));
    task.node("Timer").listen("timer-stop", e => console.log(e.getEmitter(0).prop("Elapsed")));

    task.node("Timer").StartTimer(2500);
}

RunTest();

export default {
    RunTest
};