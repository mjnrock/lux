import MasterNode from "./../MasterNode";

//!FIXME This uses the old MasterNode setup
//TODO Add abilities for: HTTP/S Server, Express Server, API, WebSocket Server, or PeerJS Server and unification abstractions to invoke an "Active" server connection and moderate it easily
export default class ServerNode extends MasterNode {
    constructor() {
        super();
        
        this._registerModule("server");
    }
};