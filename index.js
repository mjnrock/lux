try {
    require = require("esm")(module/*, options*/)
    module.exports = require("./main.js");
} catch(e) {
    module.exports = require("./index.js");
}