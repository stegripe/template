import { ApplyOptions } from "@nezuchan/decorators";
import { Precondition, PreconditionOptions } from "../stores/Precondition.js";
import { ArgumentStream } from "@sapphire/lexure";
import { proto } from "@whiskeysockets/baileys";
import { PreconditionContainerReturn } from "../lib/preconditions/IPreconditionContainer.js";

@ApplyOptions<PreconditionOptions>({
    name: isGroup.name
})
export class isGroup extends Precondition {
    public messageRun(_: ArgumentStream, data: proto.IWebMessageInfo): PreconditionContainerReturn {
        return data.key.remoteJid?.split("@")[1] === "g.us" && data.key.participant
            ? this.ok()
            : this.error({
                message: "You only can use this command inside a group chat"
            });
    }
}

declare global {
    interface Preconditions {
        isGroup: never;
    }
}
