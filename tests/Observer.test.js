import Node from "./../src/node/package";

export function RunTest() {    
    let s1 = new Node.Struct({
        cat: 1,
        test: new Node.Struct({
            cat: 2
        }),
        test2: {
            test3: new Node.Struct({
                cat: 3
            }),
            test4: [
                new Node.Struct({
                    cat: 4
                }),
                new Node.Struct({
                    cat: 5
                }),
                new Node.Struct({
                    cat: 6
                })
            ]
        },
        cats: {
            cattss: {
                catttsss: {
                    cattttssss: new Node.Struct({
                        cat: 7
                    })
                }
            },
            catsts: [
                [
                    [
                        [
                            [
                                [
                                    [
                                        [
                                            [
                                                new Node.Struct({
                                                    cat: 8
                                                })
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        }
    });

    let obs = new Node.Observer(s1, e => console.log(1, e.getType(), e.getEmitter().UUID()));
    s1.cat = 11;
    s1.test.cat = 22;
    s1.test2.test3.cat = 33;

    console.log(obs._registry)
}

RunTest();

export default {
    RunTest
};