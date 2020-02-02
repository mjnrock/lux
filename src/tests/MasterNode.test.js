import Node from "../node/Node";
import MasterNode from "../node/MasterNode";

export function RunTest() {    
    //* Entity: Assignment and Removal
    // let n1 = new Node({ node: 1 });    
    // let mn1 = new MasterNode();

    // mn1.setEntity("Sub1", n1);
    // mn1.setEntity("Sub2", { node: 2 });
    // mn1.setEntity("Sub3", { node: 3 }, [ "cheese" ]);
    // mn1.setEntity("Sub4");

    // mn1.removeEntity("Sub2");
    // console.log(mn1.getEntity("Sub1"));
    // console.log(mn1.getEntity("Sub2"));


    //* Subscriptions: Attachment and Detachment
    // let n1 = new Node({ node: 1 });
    // let mn1 = new MasterNode();

    // mn1.setNext(e => console.log(e.getType(), e.getPayload(0)));

    // // mn1.subscribeTo(n1);
    // // n1.prop("cat", 1);
    // // mn1.unsubscribeTo(n1);
    // // n1.prop("cat", 5);

    // mn1.attach(n1);
    // console.log(Object.keys(mn1._subscribers).length);
    // console.log(Object.keys(n1._subscribers).length);
    // n1.prop("cat", 1);
    // mn1.detach(n1);
    // console.log(Object.keys(mn1._subscribers).length);
    // console.log(Object.keys(n1._subscribers).length);
    // n1.prop("cat", 5);


    //* Subscriptions: Reactions and Responses
    let n1 = new Node({ node: 1 });
    let n2 = new Node({ node: 2 });
    let mn1 = new MasterNode();
    

    mn1.attach("Bob", n1);
    mn1.attach("Cat", n2);
    mn1.listen("substate-change", e => console.log(100, e.getPayload(0)));     // Listener to visually track events
    mn1.addResponse(e => {
        console.log(99, e.getType());
    });

    n1.prop("node", 5124);
    n1.prop("node", 64);
    n2.prop("node", "asFWERTWEF");

    console.log(n1.getState());
    console.log(n2.getState());
    console.log(mn1.getState());
    console.log(mn1.$("Bob"));
    console.log(mn1.$("Cat"));
    console.log(mn1.$());
}

RunTest();

export default {
    RunTest
};