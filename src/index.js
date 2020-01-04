import Core from "./core/package";

const Lux = {
    Core
};

const Lumen = new Core.ClassDecorators.StateEvents();

//Inject Lux into globals
if(window !== void 0) {
    window.Lux = Lux;
    window.Lumen = Lumen;
}
if(global !== void 0) {
    global.Lux = Lux;
    global.Lumen = Lumen;
}

export default Lux;