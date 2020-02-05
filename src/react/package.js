import Context from "./Context";
import ReactorComponent from "./ReactorComponent";

export function Connect(clazz) {
    clazz.contextType = Context;

    return clazz;
};

export default {    
    Connect,
    
    Context,
    ReactorComponent
};