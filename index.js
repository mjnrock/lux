try {
    // eslint-disable-next-line
    require = require("esm")(module/*, options*/)
    module.exports = require("./main.js");
} catch(e) {
    module.exports = require("./main.js");
}