import Context from "./Context";
import MasterNodeComponent from "./MasterNodeComponent";
import ObserverComponent from "./ObserverComponent";

export const EnumContextType = {
    MASTER_NODE: 1,
    OBSERVER: 2
};

export function Connect(clazz, type = EnumContextType.MASTER_NODE) {
    if(type === EnumContextType.MASTER_NODE) {
        clazz.contextType = Context.MasterNodeContext;
    } else if(type === EnumContextType.OBSERVER) {
        clazz.contextType = Context.ObserverContext;
    }

    return clazz;
};

export default {    
    EnumContextType,

    Connect,
    
    Context,
    MasterNodeComponent,
    ObserverComponent
};