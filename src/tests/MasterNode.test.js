import Node from "./../node/package";

export function RunTest() {
    // let n0 = new Node.Node();

    // let n1 = new Node.Node();
    // let n2 = new Node.Node();
    
    // let mn1 = new Node.MasterNode();

    // n0.setNext(e => console.log(e.getType(), e.getPayload(0)));
    // mn1.subscribe(n0);
    
    // mn1.setNext(e => console.log(e.getEmitter().UUID(), e.getType(), e.getPayload(0)));
    // mn1.dominate("Test", n1);
    // mn1.dominate("Cat", n2);

    // mn1.direct("Cat", (name, node) => {
    //     return [ node.ID(), name ];
    // });
    // mn1.command((name, node) => {
    //     return [ name, node ];
    // });

    // mn1.spy("Test", "Kitterz", e => console.log(e.getPayload(0)));
    // n1.prop("Kitterz", {
    //     Cat: 15
    // });
    // n1.oprop("Kitterz", "Cat", 59);
    // console.log(n1.prop("Kitterz"));
    // n1.prop("Kitterz", -46231);

    // console.log("*******");
    // console.log(mn1.getNodeName(n1));
    // console.log(mn1.getNodeName(n1.UUID()));
    // console.log(mn1.getNodeName(n2));
    // console.log(mn1.getNodeName(n2.UUID()));
    // console.log(mn1.getNodeName(n0));
    // console.log(mn1.getNodeName(n0.UUID()));


    //* Behavior Testing
    let n1 = new Node.Node();
    let n2 = new Node.Node();
    
    let mn1 = new Node.MasterNode();

    mn1.listen("substate-change", console.log);

    mn1.flagOnIsReactionary();
    mn1.listen("dominate", e => console.log(
        "DOMINATED"
    ));

    mn1.dominate("Cat", n1);
    mn1.dominate("Dog", n2);

    n1.prop("Meow", {
        "submeow": "kitties!",
        "yo": 12345
    });

    console.log(mn1._state);
    console.log(mn1.getSubState());
    console.log(mn1.getSubState("Cat"));
    console.log(mn1.getSubState("Cat.Meow"));
    console.log(mn1.getSubState("Cat.Meow.submeow"));
    console.log(mn1.getSubState("Cat.Meow.yo"));
}

export default {
    RunTest
};