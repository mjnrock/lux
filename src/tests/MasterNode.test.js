import Node from "./../node/package";

export function RunTest() {
    let n0 = new Node.Node();

    let n1 = new Node.Node();
    let n2 = new Node.Node();
    
    let mn1 = new Node.MasterNode();

    n0.setNext(e => console.log(e.getType(), e.getPayload(0)));
    mn1.setNext(e => console.log(e.getEmitter().UUID(), e.getType(), e.getPayload(0)));
    mn1.subscribe(n0);
    
    mn1.dominate("Test", n1);
    mn1.dominate("Cat", n2);

    mn1.direct("Cat", (node, name) => {
        return [ node.ID(), name ];
    });
    mn1.command((node, nodes) => {
        return [ node.ID(), nodes.length ];
    });

    n1.prop("Kitterz", 59);
}

export default {
    RunTest
};