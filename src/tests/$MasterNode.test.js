import Node from "./../node/Node";
import MasterNode from "./../node/$MasterNode";

export function RunTest() {    
    //* Subordinate: Assignment and Removal
    // let n1 = new Node({ node: 1 });    
    // let mn1 = new MasterNode();

    // mn1.setSubordinate("Sub1", n1);
    // mn1.setSubordinate("Sub2", { node: 2 });
    // mn1.setSubordinate("Sub3", { node: 3 }, [ "cheese" ]);
    // mn1.setSubordinate("Sub4");

    // mn1.removeSubordinate("Sub2");
    // console.log(mn1.getSubordinate("Sub1"));
    // console.log(mn1.getSubordinate("Sub2"));

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
}

RunTest();

export default {
    RunTest
};