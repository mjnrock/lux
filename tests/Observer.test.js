import Node from "./../src/node/package";

export function RunTest() {    
    let s1 = new Node.Struct({
        // Shallow tests
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

        // Deep nesting tests
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
                                                    cat: 8,
                                                    cat2: new Node.Struct({
                                                        cat: 9
                                                    })
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
        },
        GetTest: null
    });

    let obs = new Node.Observer(s1, e => console.log(1, e.getType(), e.getPayload()));
    s1.cat = 11;
    s1.test.cat = 22;
    s1.test2.test3.cat = 33;

    
    s1.GET("GetTest", "http://api.open-notify.org/astros.json");

    // setTimeout(() => {
    //     console.log(s1._state);
    // }, 1000);
}

RunTest();

export default {
    RunTest
};