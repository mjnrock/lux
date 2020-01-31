import TaskManager from "./../node/task-manager/package";

export function RunTest() {
    let task = new TaskManager.Task("Cats!");

    task.listen("timer-start", console.log);
    // task.node("Timer").listen("timer-start", console.log);

    task.node("Timer").StartTimer(10);
}

RunTest();

export default {
    RunTest
};