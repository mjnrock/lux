import Struct from "../node/Struct";
import Node from "./../node/Node";

export function RunTest() {
    //* Core
    let kiszka = new Struct({
        name: "Kiszka",
        type: "Cat",
        test: 9
    });
    let buddha = new Struct({
        name: "Buddha",
        type: "Cat",
        test: 8
    });
    let Matt = new Struct({
        name: "Matt",
        type: "Player",
        kiszka,
        buddha,
        test: 1
    });

    
    Matt.subscribe(e => {
        let { prop } = e.getPayload();

        if(prop.length > 1) {
            let res = Struct.GetBubbleProp(Matt, prop, 1);

            console.log(e.getPayload());
            console.log(res);
        } else {
            console.log(e.getPayload());
        }
    });

    Matt.test = 14;
    buddha.test = 19;
}

RunTest();

export default {
    RunTest
};