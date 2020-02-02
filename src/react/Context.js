import React from "react";
import Node from "./../node/package";

const MNode = new Node.MasterNode();
MNode.flagOnIsReactionary();
MNode.flagOnIsReactionStateSave();

const NodeContext = React.createContext(MNode);

export default NodeContext;