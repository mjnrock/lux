import React from "react";
import Node from "./../node/package";

const MNode = new Node.MasterNode();

const NodeContext = React.createContext(MNode);

export default {
    MNode,
    
    NodeContext
};