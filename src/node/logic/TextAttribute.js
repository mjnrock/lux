import Attribute from "./Attribute";

export default class TextAttribute extends Attribute {
    constructor(value, name = null) {
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

    Replace(search, repl) {
        return this.Name(this.Name().replace(search, repl));
    }
    Concat(...strings) {
        let str = this.Name().concat(...strings);

        return this.Name(str);
    }
    Trim() {
        return this.Name(this.Name().trim());
    }

    ToLowerCase() {
        return this.Name(this.Name().toLowerCase());
    }
    ToUpperCase() {
        return this.Name(this.Name().toUpperCase());
    }

    Char(index) {
        return this.Name().charAt(index);
    }
    CharCode(index) {
        return this.Name().charCodeAt(index);
    }
    
    FromCharCode(...codes) {
        return this.Name(String.fromCharCode(...codes));
    }

    Normalize(form) {
        return this.Name(this.Name().normalize(form));
    }

    SubString(start = 0, length = null) {
        return this.Name().substr(start, length);
    }
    Split(sep, limit) {
        return this.Name().split(sep, limit);
    }

    Includes(search, pos) {
        return this.Name().includes(search, pos);
    }
    Search(regex) {
        return this.Name().search(regex);
    }
    Match(regex) {
        return this.Name().match(regex);
    }
    MatchAll(regex) {
        return this.Name().matchAll(regex);
    }
    Test(regex, flags) {
        let rx = RegExp(regex, flags);

        return rx.test(this.Name());
    }
    Find(search, start, isLastIndexOf = false) {
        if(isLastIndexOf) {
            return this.Name().lastIndexOf(search, start);
        }

        return this.Name().indexOf(search, start);
    }
};