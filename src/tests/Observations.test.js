import Node from "./../node/package";

export function RunTest() {
    let n1 = new Node.Node();
    let n2 = new Node.Node();
    let n3 = new Node.Node();

    n2.setNext(e => {
        console.log("---------------");
        console.log(e.getType(), e.getPayload());
        console.log("---------------");
    });
    let s1 = n1.subscribe(n2);
    let s2 = n1.subscribe(n3);
    let l1 = n1.listen("prop-change", (e) => console.log("LISTEN", e.getPayload()));
    let l2 = n1.listen("prop-change", (e) => console.log("LISTEN2", e.getPayload()));
    let w1 = n1.watch("Cat", (e) => console.log("WATCH", e.getPayload()));
    let w2 = n1.watch("Cat", (e) => console.log("WATCH2", e.getPayload()));

    console.log(n1);

    n1.prop("Dog", 3);
    n1.unsubscribe(s1);
    n1.prop("Cat", 5);
    n1.prop("Cat", 6);
    n1.unwatch(w1);
    n1.prop("Cat", 7);
    n1.unlisten(l1);
    n1.prop("Dog", 19);
    console.log(n1.prop("Dog"));

    n1.prop("Obj", {
        Cats: {
            Cat: 1
        },
        Dogs: [
            1, 2
        ]
    });
    n1.listen("prop-change::object", console.log);

    n1.oprop("Obj", "Cats.Cat", 999);

    console.log(n1.oprop("Obj"));
}

export default {
    RunTest
};