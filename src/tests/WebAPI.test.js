import Node from "./../node/package";

export function RunTest() {
    let n1 = new Node.Node();
    let web = new Node.DataConnector.WebAPI("localhost", 3000, false);

    web.link(n1);
    // n1.setNext((e) => console.log(e.getType(), e.getPayload(), e.getEmitter()));
    n1.setNext((e) => console.log(e.getPayload()));

    web.GetJson("api");
    web.GetJson("api");
    web.GetJson("api");
    web.GetJson("api");
}

export default {
    RunTest
};