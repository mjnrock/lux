import Peer from "peerjs";

import { GenerateUUID } from "./../../core/helper";
import Node from "./../Node";
import Packet from "./Packet";

export default class PeerClient extends Node {
    constructor(server = null) {
        super();

        this.prop("ID", GenerateUUID());
        // this.prop("ID", +(Math.floor(Math.random() * 100)));

        this.Config = server || {
            host: "192.168.86.102",
            port: 3001,
            path: "/peer"
        };
        this.Connector = new Peer(this.prop("ID"), {
            ...this.Config,
            debug: 3
        });

        this.Connector.on("connection", dataConn => {
            this.Register(dataConn.peer, dataConn);

            this.emit("data-connection", dataConn);
        });

        this.prop("Peers", []);
        this.prop("Connections", {});

        this.addEvent(
            "json",
            "data-connection",
            "connect",
            "destroy"
        );

        this._registerModule("data-connector");
    }

    ReceiveJSON(json) {
        try {
            let obj = json;
    
            while(typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(json);
            }
    
            this.emit("json", obj);
        } catch(e) {
            console.log("Could not parse message");
        }

        return this;
    }
    SendJSON(peerId, msg) {
        if(this.HasConnection(peerId)) {
            let conn = this.oprop("Connections", peerId);

            while(!(typeof msg === "string" || msg instanceof String)) {
                msg = JSON.stringify(msg);
            }

            let packet = new Packet(this.prop("ID"), peerId, msg);
            conn.send(packet);
            // conn.send(packet.toJSON());
        }

        return this;
    }
    BroadcastJSON(msg) {
        for(let uuid in this.prop("Connections")) {
            this.SendJSON(uuid, msg);
        }

        return this;
    }

    
    Connect(peerId, serialization = "json") {
        try {
            let conn = this.Connector.connect(peerId, {
                serialization
            });
    
            this.Register(peerId, conn);
            this.emit("connect", conn);
        } catch(e) {
            console.log(`[Connection Failed]: `, e);
        }

        return this;
    }
    Disconnect(peerId) {
        try {
            let conn = this.prop("Connections")[ peerId ];
    
            if(conn.open) {
                conn.close();
                this.emit("destroy", peerId);
            }
        } catch(e) {
            console.log(`[Closure Failure]: `, e);
        }

        this.Unregister(peerId);

        return this;
    }


    Register(peerId, conn = null) {
        this.RegisterPeer(peerId);
        this.RegisterConnection(peerId, conn);

        return this;
    }
    Unregister(peerId) {
        this.UnregisterPeer(peerId);
        this.UnregisterConnection(peerId);

        return this;
    }


    HasPeer(peerId) {
        return this.prop("Peers").includes(peerId);
    }
    RegisterPeer(peerId) {
        if(!this.HasPeer(peerId)) {
            this.prop("Peers").push(peerId);
        }

        return this;
    }
    UnregisterPeer(peerId) {
        this.prop("Peers", this.prop("Peers").filter(p => p !== peerId));

        return this;
    }


    HasConnection(peerId) {
        return Object.keys(this.prop("Connections")).includes(peerId);
    }
    RegisterConnection(peerId, conn) {
        if(!this.HasConnection(peerId)) {
            if(conn.serialization === "json") {
                conn.on("data", this.ReceiveJSON.bind(this));
            }

            this.oprop("Connections", peerId, conn);
        }

        return this;
    }
    UnregisterConnection(peerId) {
        delete this.oprop("Connections", peerId);

        return this;
    }
}