import Core from "./core/package";

export default {
    Core,

    InjectLux() {
        if(window !== void 0) {
            window.Lux = Lux;
        }
        if(global !== void 0) {
            global.Lux = Lux;
        }
    }
};