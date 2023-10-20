import { Store } from "@sapphire/pieces";
import { Precondition, PreconditionContext } from "./Precondition.js";
import { Command } from "./Command.js";
import { Result } from "@sapphire/result";
import { ArgumentStream } from "@sapphire/lexure";
import { proto } from "@whiskeysockets/baileys";
import { Identifiers } from "../lib/errors/Identifiers.js";
import { UserError } from "../lib/errors/UserError.js";

export class PreconditionStore extends Store<Precondition> {
    private readonly globalPreconditions: Precondition[] = [];

    public constructor() {
        super(Precondition, { name: "preconditions" });
    }

    public async messageRun(args: ArgumentStream, data: proto.IWebMessageInfo, command: Command, context: PreconditionContext = {}): Promise<Result<unknown, UserError>> {
        for (const precondition of this.globalPreconditions) {
            const result = precondition.messageRun
                ? await precondition.messageRun(args, data, command, context)
                : await precondition.error({
                    identifier: Identifiers.PreconditionMissingMessageHandler,
                    message: `The precondition "${precondition.name}" is missing a "messageRun" handler, but it was requested for the "${command.name}" command.`
				  });

            if (result.isErr()) {
                return result;
            }
        }

        return Result.ok();
    }

    public override set(key: string, value: Precondition): this {
        if (value.position !== null) {
            const index = this.globalPreconditions.findIndex(precondition => precondition.position! >= value.position!);

            if (index === -1) this.globalPreconditions.push(value);
            else this.globalPreconditions.splice(index, 0, value);
        }

        return super.set(key, value);
    }

    public override delete(key: string): boolean {
        const index = this.globalPreconditions.findIndex(precondition => precondition.name === key);

        if (index !== -1) this.globalPreconditions.splice(index, 1);

        return super.delete(key);
    }

    public override clear(): void {
        this.globalPreconditions.length = 0;
        return super.clear();
    }
}
