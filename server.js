import Lux from "./src/index";

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.set("trust proxy", true);

// ======================================
let Logs = [];
let debug = (...args) => {
    let arr = [];
    args.forEach(arg => {
        if(typeof arg === "object") {

            let cache = [];
            arg = JSON.parse(JSON.stringify(arg, (key, value) => {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return;
                    }
                    
                    cache.push(value);
                }

                return value;
            }));
            cache = null;
        }

        arr.push(arg);
    });

    Logs = [
        ...Logs,
        ...arr
    ];

    return arr;
};
// console.log = debug;
// console.log(" ----- TESTS: Observations -----");
// Lux.Tests.Observations.RunTest();
// console.log(" ----- END: Observations -----");

// console.log(" ----- TESTS: Fetch -----");
// Lux.Tests.Fetch.RunTest();
// console.log(" ----- END: Fetch -----");

console.log(" ----- TESTS: Connectors -----");
Lux.Tests.WebAPI.RunTest();
console.log(" ----- END: Connectors -----");

// console.log(" ----- TESTS: Connectors -----");
// let api = new Lux.Node.Connector.WebAPI("localhost", port);

// api.GetJson(`/api/`, {
//     test: "hey",
//     test2: "yo"
// }, console.log);
// // api.GET(`api`).then(r => console.log(r));

// console.log(" ----- END: Connectors -----");

// app.get("/api", (req, res) => {
//     res.send("Hello");
//     res.end();
// });
app.get("/api", (req, res) => {
    res.send(JSON.stringify({
        result: "SUCCESS",
        query: req.query,
        url: req._parsedUrl.pathname
    }));
    res.end();
});
app.get("/logs", (req, res) => {
    res.send(Logs);
    res.end();
});
// ======================================

app.listen(port, () => console.log(`Server listening on port ${ port }!`));