import Message from "./Message";
import Node from "./../Node";
import Member from "./Member";

export default class Channel extends Node {
    constructor(name) {
        super();

        this.prop("Name", name);
        this.prop("Messages", []);
        this.prop("Members", {});
        
        this.addEvent(
            "sync",
            "message",
            "member-add",
            "member-remove"
        );

        this._registerModule("chat.channel");
    }

    SyncChannel(messages) {
        let A = this.prop("Messages"),
            B = messages,
            Auuid = A.map(m => m.UUID),
            Buuid = B.map(m => m.UUID),
            Bo = {};
        
        B.forEach(m => Bo[ m.UUID ] = m);

        let diff = Buuid.filter(x => !Auuid.includes(x));

        for(let key in diff) {
            A.push(Bo[ diff[ key ] ]);
        }

        this.prop("Messages", A);

        this.emit("sync");

        return this;
    }

    AddMessage(msg) {
        if(!/.*\S.*/gmi.test(msg)) {
            return false;
        }

        if(msg instanceof Message) {
            this.aprop("Messages", -1, msg);            
            this.emit("message", msg);
        } else if(typeof msg === "object") {
            if(msg.Author && msg.Content) {
                this.emit("message", msg);

                return this.AddMessage(Message.fromJSON(msg));
            }

            return false;
        } else if(arguments.length > 1) {
            return this.AddMessage(new Message(...arguments));
        }

        return this;
    }

    AddMember(user, uuid = null) {
        let member = new Member(user, uuid);

        this.oprop("Members", member.UUID(), member);
        this.emit("member-add", member);
        
        return member;
    }
    RemoveMember(memberOrUUID) {
        let members = this.prop("Members");
        
        if(memberOrUUID instanceof Member) {
            this.emit("member-remove", memberOrUUID.UUID());

            delete members[ memberOrUUID.UUID() ];
        } else if(typeof memberOrUUID === "string" || memberOrUUID instanceof String) {
            this.emit("member-remove", memberOrUUID);

            delete members[ memberOrUUID ];
        } else {
            return false;
        }

        this.prop("Members", members);

        return true;
    }
}