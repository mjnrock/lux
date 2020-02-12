import Struct from "../node/$Struct";
import Node from "../node/Node";

export function RunTest() {
    //* Core
    // let Player = new Struct({
    //     name: "Matt",
    //     type: "Cat",
    //     items: [ "hat" ]
    // });

    // console.log(Player.name);
    // console.log(Player.items.push(15));
    // console.log(Player._watchers);
    
    // console.log(Player);
    // console.log(Player instanceof Struct);

    
    //* Basic Validator
    // let Player = new Struct({
    //     name: "Matt",
    //     type: "Cat",
    //     items: [ "hat" ]
    // }, {
    //     type: value => typeof value === "number"
    // });

    // Player.type = "Bob";
    // console.log(Player.type);

    // Player.type = 55;
    // console.log(Player.type);

    // console.log(Player);

    let n1 = new Node();
    let Player = new Struct({
        name: "Matt",
        type: "Cat",
        items: [ "hat" ]
    }, {
        name: value => typeof value === "string" || value instanceof String,
        type: value => typeof value === "number"
    });

    n1.setNext(e => {
        console.log("NEXT", e.getPayload());
    });
    Player.subscribe(n1);
    Player.watch("name", e => console.log("WATCH", e.getPayload()));

    Player.name = 5;
    Player.name = "15";

    console.log(Player);
}

RunTest();

export default {
    RunTest
};