import Channel from "./Channel";
import Node from "../Node";

export default class MultiChannel extends Node {
    constructor() {
        super();

        this.prop("Channels", {});

        this.addEvent(
            "channel-message"
        );

        this._registerModule("chat-message.multichannel");
    }

    CreateChannel(name) {
        if(!name) {
            throw new Error("[Channel Error]: Channel name cannot be falsey");
        }

        let channel = new Channel(name);
            
        channel.watch("Messages", (prop, data, _this) => {
            let lastMsg = data[ data.length - 1 ];

            this.call("channel-message", channel, lastMsg);
        });

        this.oprop("Channels", name, channel);

        return channel;
    }
    DestroyChannel(uuid, name) {
        let channels = this.prop("Channels");

        delete channels[ name ];

        this.unwatch(uuid);
        this.prop("Channels", channels);

        return this;
    }

    Get(name) {
        let channel = this.oprop("Channels", name);
        
        if(channel) {
            return channel;
        }
        
        return false;
    }

    /**
     * Send a Message to a Channel
     * @param {Channel|string} channelOrName 
     * @param  {...any} payload 
     */
    Send(channelOrName, ...payload) {
        try {
            channelOrName = channelOrName instanceof Channel ? channelOrName : this.oprop("Channels", channelOrName);
            
            if(channelOrName) {
                channelOrName.AddMessage(...payload);
            } else {
                console.log(`[Invalid Channel]`);
            }
        } catch (e) {
            console.log(`[Invalid Message]: `, e);
        }

        return this;
    }
}