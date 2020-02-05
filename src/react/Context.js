import React from "react";
import Node from "./../node/package";

const MasterNode = new Node.MasterNode();

const NodeContext = React.createContext(MasterNode);

export default {
    MasterNode,

    NodeContext
};