import Core from "./core/package";
import Node from "./node/package";

let n1 = new Node.Node();
let n2 = new Node.Node();

n2.setNext((event, result) => {
    console.log("---------------");
    console.log(event);
    console.log(result);
    console.log("---------------");
});
n1.subscribe(n2);
// n1.listen("prop-change", (r, [ e ]) => console.log(e, r));

n1.prop("Cat", 5);
n1.prop("Cat", 6);

export default {
    Core,
    Node
};