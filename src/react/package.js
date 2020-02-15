import Context from "./Context";
import ReactorComponent from "./ReactorComponent";

export function Connect(clazz) {
    clazz.contextType = Context.NodeContext;

    return clazz;
};

export default {    
    Connect,
    
    Context,
    ReactorComponent
};