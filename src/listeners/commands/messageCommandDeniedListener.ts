import { ApplyOptions } from "@nezuchan/decorators";
import { Listener, ListenerOptions } from "../../stores/Listener.js";
import { Events } from "../../constants/EventEnums.js";
import { proto } from "@whiskeysockets/baileys";
import { Command } from "../../stores/Command.js";
import { UserError } from "../../lib/errors/UserError.js";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandDenied
})
export class messageCommandDenied extends Listener {
    public async run(res: UserError, { msg }: { msg: proto.IWebMessageInfo; command: Command; rawArgs: string[] }): Promise<any> {
        if (!res.message || Reflect.get(msg, "silent") !== undefined) return;
        return this.container.client.socket?.sendMessage(msg.key.remoteJid!, {
            text: res.message
        });
    }
}
