import React from "react";
import Node from "./../node/package";

const MasterNode = new Node.MasterNode();
const Observer = new Node.Observer();

const MasterNodeContext = React.createContext(MasterNode);
const ObserverContext = React.createContext(Observer);

export default {
    MasterNode,

    MasterNodeContext,
    ObserverContext
};