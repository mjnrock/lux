const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const httpPORT = 3000;
http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), uri);
    let mimes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
    };

    fs.exists(filename, exists => {
        if(!exists) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found\n");
            res.end();

            return;
        }

        if(fs.statSync(filename).isDirectory()) {
            filename += `/index.html`;
        }

        fs.readFile(filename, "binary", (err, file) => {
            if(err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write(`${ err }\n`);
                res.end();
                
                return;
            }

            let headers = {};
            let contentType = mimes[ path.extname(filename) ];
            
            if(contentType) {
                headers[ "Content-Type" ] = contentType;
            }

            res.writeHead(200, headers);
            res.write(file, "binary");
            res.end();
        });
    });

}).listen(httpPORT);

console.log(`Server is now running at: http://localhost:${ httpPORT }`);