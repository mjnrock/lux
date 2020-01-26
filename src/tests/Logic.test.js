import Node from "../node/package";

export function RunTest() {
    // console.log("----- START ATTRIBUTE -----");

    // let a1 = new Node.Logic.Attribute();
    // console.log(a1.Value());
    // a1.Value(9);
    // console.log(a1.Value());
    // let a2 = new Node.Logic.Attribute(15);
    // console.log(a2.Value());
    // a2.Value(4);
    // console.log(a2.Value());

    // console.log("----- END ATTRIBUTE -----");


    // console.log("----- START NUMBER -----");

    // let n1 = new Node.Logic.NumberAttribute(0);
    // let n2 = new Node.Logic.NumberAttribute(1);
    // let n3 = new Node.Logic.NumberAttribute(2);

    // n1.Value(10);
    // console.log([ 10 ], n1.Value());
    // n1.Min(0);
    // console.log([ 0 ], n1.Min());
    // n1.Max(20);
    // console.log([ 20 ], n1.Max());
    // n1.Value(-5);
    // console.log([ -5 ], n1.Value());
    // console.log([ -5 ], n1.IsAtMin(), n1.IsAtMax());
    // n1.Value(25);
    // console.log([ 25 ], n1.Value());
    // console.log([ 25 ], n1.IsAtMin(), n1.IsAtMax());
    // n1.Range(5, 8);
    // console.log([ 5, 8 ], n1.Value(), n1.Min(), n1.Max());
    // n1.Value(-5);
    // console.log([ -5 ], n1.Value());
    // n1.Value(25);
    // console.log([ 25 ], n1.Value());

    // n1.init(5, 0, 10);
    // console.log(n1.ToFixed(6));
    // console.log(n1.ToPercent(true));
    // console.log(n1.ToPercent());
    // console.log(n1.ToRate());
    
    // n1.Inc().Inc().Inc().Inc().Inc().Inc();
    // console.log(n1.Value());
    // n1.Dec().Dec();
    // console.log(n1.Value());

    // console.log([ ], n1.Value(), n1.Min(), n1.Max());
    // n1.Add(5, n2);
    // console.log([ 5, "+", 1 ], n1.Value());
    // n1.init();
    // console.log([ ], n1.Value(), n1.Min(), n1.Max());
    // n1.Subtract(5, n2, n2);
    // console.log([ 5, "-", 1, "-", 1 ], n1.Value());
    // n1.init(1);
    // console.log([ ], n1.Value(), n1.Min(), n1.Max());
    // n1.Multiply(5, n3, 1.2);
    // console.log([ 5, "*", 2, "*", 1.2 ], n1.Value());
    // n1.init(1);
    // console.log([ ], n1.Value(), n1.Min(), n1.Max());
    // n1.Divide(5, n3, 1.2);
    // console.log([ 5, "/", 2, "/", 1.2 ], n1.Value());

    // console.log("----- END NUMBER -----");

    // let t1 = new Node.Logic.TextAttribute();
    // let t2 = new Node.Logic.TextAttribute();

    // let c1 = new Node.Logic.Condition(
    //     // Node.Logic.Enum.ConditionType.EQUALS,
    //     // 4

    //     // Node.Logic.Enum.ConditionType.NOT_EQUALS,
    //     // 4

    //     // Node.Logic.Enum.ConditionType.BETWEEN,
    //     // 4,
    //     // 10

    //     // Node.Logic.Enum.ConditionType.IN,
    //     // 1, 2, 3, 4

    //     // Node.Logic.Enum.ConditionType.NOT_IN,
    //     // 1, 2, 3, 4

    //     // Node.Logic.Enum.ConditionType.GT,
    //     // 4

    //     // Node.Logic.Enum.ConditionType.GTE,
    //     // 4

    //     // Node.Logic.Enum.ConditionType.LT,
    //     // 4

    //     // Node.Logic.Enum.ConditionType.LTE,
    //     // 4

    //     // Node.Logic.Enum.ConditionType.MATCH,
    //     // /^([0-9]){0,1}$/i
    // );
    // let n1 = new Node.Logic.NumberAttribute();
    // c1.listen("run", e => console.log(e.getPayload(0)));

    // c1.Assign(n1);
    // // c1.Unassign(n1);     // Throws error appropriately

    // n1.Value(5);
    // c1.Run();
    // n1.Value(59);
    // c1.Run();
    // n1.Value(1);
    // c1.Run();
    // n1.Value(4);
    // c1.Run();



    let c1 = new Node.Logic.Condition(
        Node.Logic.Enum.ConditionType.GT,
        4
    );
    let c2 = new Node.Logic.Condition(
        Node.Logic.Enum.ConditionType.LTE,
        4
    );
    let c3 = new Node.Logic.Condition(
        Node.Logic.Enum.ConditionType.MATCH,
        /^([0-9]){0,1}$/i
    );
    let n1 = new Node.Logic.NumberAttribute(15);
    let n2 = new Node.Logic.NumberAttribute(84);
    let n3 = new Node.Logic.NumberAttribute(9);

    c1.Assign(n1);  // T
    c2.Assign(n2);  // F
    c3.Assign(n3);  // T

    let p1 = new Node.Logic.Proposition([
        c1,
        c2,
        c3
    ]);
    p1.listen("run", e => console.log(e.getPayload(0)));

    p1.Run();
    p1.RunAnd();
    p1.RunNotAnd();
    p1.RunOr();
    p1.RunNotOr();
}

export default {
    RunTest
};