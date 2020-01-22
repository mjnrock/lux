import Core from "./core/package";
import Node from "./node/package";

let n1 = new Node.Node();
let n2 = new Node.Node();

n2.setNext(e => {
    console.log("---------------");
    console.log(e);
    console.log("---------------");
});
n1.subscribe(n2);
n1.listen("prop-change", (e) => console.log("LISTEN:", e.getPayload()));
n1.watch("Cat", (e) => console.log("WATCH:", e.getPayload()));

n1.prop("Dog", 3);
n1.prop("Cat", 5);
n1.prop("Cat", 6);

export default {
    Core,
    Node
};