import Node from "./../node/package";

export function RunTest() {
    let n1 = new Node.Node();
    let web = new Node.DataConnector.WebSocket("localhost", 3000, false);

    web.link(n1);
    n1.setNext((e) => console.log(e.getType()));

    web.listen("open", () => web.Send("Hello!"));
    web.Connect();
}

export default {
    RunTest
};