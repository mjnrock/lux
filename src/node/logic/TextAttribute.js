import Attribute from "./Attribute";

export default class TextAttribute extends Attribute {
    constructor(value, { name = null } = {}) {
        super(value);

        this.prop("name", name);

        return this;
    }

    init(name, value) {
        this.Value(value);
        this.prop("name", name);
        
        return this;
    }

    Name(name) {
        if(name === void 0) {
            return this.prop("name");
        }

        return this.prop("name", name);
    }

    replace(search, repl) {
        return this.Name(this.Name().replace(search, repl));
    }
    concat(...strings) {
        let str = this.Name().concat(...strings);

        return this.Name(str);
    }
    trim() {
        return this.Name(this.Name().trim());
    }

    toLowerCase() {
        return this.Name(this.Name().toLowerCase());
    }
    toUpperCase() {
        return this.Name(this.Name().toUpperCase());
    }

    char(index) {
        return this.Name().charAt(index);
    }
    charCode(index) {
        return this.Name().charCodeAt(index);
    }
    
    fromCharCode(...codes) {
        return this.Name(String.fromCharCode(...codes));
    }

    normalize(form) {
        return this.Name(this.Name().normalize(form));
    }

    subString(start = 0, length = null) {
        return this.Name().substr(start, length);
    }
    split(sep, limit) {
        return this.Name().split(sep, limit);
    }

    includes(search, pos) {
        return this.Name().includes(search, pos);
    }
    search(regex) {
        return this.Name().search(regex);
    }
    match(regex) {
        return this.Name().match(regex);
    }
    matchAll(regex) {
        return this.Name().matchAll(regex);
    }
    test(regex, flags) {
        let rx = RegExp(regex, flags);

        return rx.test(this.Name());
    }
    find(search, start, isLastIndexOf = false) {
        if(isLastIndexOf) {
            return this.Name().lastIndexOf(search, start);
        }

        return this.Name().indexOf(search, start);
    }
};