import Node from "./../node/package";

export function RunTest() {
    let n1 = new Node.Node();

    n1.watch("ToDo", e => console.log(e.getPayload().current));

    n1.asyncJsonProp("ToDo", "https://jsonplaceholder.typicode.com/todos/1");   // Some random JSON test site (remove the /1 to get a bunch of todos)

    setTimeout(() => {
        console.log(n1.prop("ToDo"));

        // let n2 = new Node.Node();

        // n2.watch("ToDo", e => console.log(e.getPayload().current));

        // n2.jsonPost("ToDo", `http://validate.jsontest.com/?json={"key":"value"}`)    // Not working, could be the endpoint, it sent a 503 response
        //     .then(data => console.log(data));
    }, 1000);
}

export default {
    RunTest
};