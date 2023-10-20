import { ApplyOptions } from "@nezuchan/decorators";
import { Listener, ListenerOptions } from "../../stores/Listener.js";
import { Events } from "../../constants/EventEnums.js";
import { proto } from "@whiskeysockets/baileys";

@ApplyOptions<ListenerOptions>({
    event: Events.PossibleMessageCommand
})
export class possibleMessageCommandRun extends Listener {
    public run(msg: proto.IWebMessageInfo, content: string): any {
        const args = content.split(/ +/g);
        const commandName = args[0];
        const command = this.container.client.stores.get("commands")
            .find(x => x.name === commandName || x.aliases.includes(commandName));

        if (!command) {
            this.container.client.emit(Events.UnknownMessageCommand, { msg, commandName, rawArgs: args });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (command.enabled === false) {
            this.container.client.emit(Events.MessageCommandDisabled, { msg, commandName, rawArgs: args });
            return;
        }

        if (!command.messageRun) {
            this.container.client.emit(Events.CommandDoesNotHaveMessageCommandHandler, { msg, commandName, rawArgs: args });
            return;
        }

        return this.container.client.emit(Events.PreMessageCommandRun, { msg, command, rawArgs: args });
    }
}
