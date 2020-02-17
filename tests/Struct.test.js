import Struct from "./../src/node/Struct";
import Node from "./../src/node/package";

export function RunTest() {
    //* Core
    // let kiszka = new Struct({
    //     name: "Kiszka",
    //     type: "Cat",
    //     test: 9
    // });
    // let buddha = new Struct({
    //     name: "Buddha",
    //     type: "Cat",
    //     test: 8
    // });
    // let Matt = new Struct({
    //     name: "Matt",
    //     type: "Player",
    //     kiszka,
    //     buddha,
    //     test: 1
    // });

    
    // Matt.subscribe(e => {
    //     let { prop } = e.getPayload();

    //     if(prop.length > 1) {
    //         let res = Struct.GetBubbleProp(Matt, prop, 1);

    //         console.log(e.getPayload());
    //         console.log(res);
    //     } else {
    //         console.log(e.getPayload());
    //     }
    // });

    // Matt.test = 14;
    // buddha.test = 19;

    //* Validator - RegEx
    let s1 = new Struct({
        name: "RegEx",
        Value: null
    }, {
        Value: new RegExp("^[0-9]{1,}$")
    });

    console.log(s1.Value);  //= null
    s1.Value = "asdf";
    console.log(s1.Value);  //= null
    s1.Value = 123;
    console.log(s1.Value);  //= 123
}

RunTest();

export default {
    RunTest
};