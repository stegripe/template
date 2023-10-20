/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Result, err } from "@sapphire/result";
import { IPreconditionContainer } from "./IPreconditionContainer.js";
import { container } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { PreconditionContext, PreconditionKeys, SimplePreconditionKeys } from "../../stores/Precondition.js";
import { ArgumentStream } from "@sapphire/lexure";
import { proto } from "@whiskeysockets/baileys";
import { UserError } from "../errors/UserError.js";
import { Identifiers } from "../errors/Identifiers.js";
import { Command } from "../../stores/Command.js";

export interface SimplePreconditionSingleResolvableDetails {
    name: SimplePreconditionKeys;
}

export interface PreconditionSingleResolvableDetails<K extends PreconditionKeys = PreconditionKeys> {
    name: K;
    context: Preconditions[K];
}

export type PreconditionSingleResolvable = PreconditionSingleResolvableDetails | SimplePreconditionKeys | SimplePreconditionSingleResolvableDetails;

export class PreconditionContainerSingle implements IPreconditionContainer {
    public readonly context: Record<PropertyKey, unknown>;
    public readonly name: string;

    public constructor(data: PreconditionSingleResolvable) {
        if (typeof data === "string") {
            this.name = data;
            this.context = {};
        } else {
            this.context = Reflect.get(data, "context") ?? {};
            this.name = data.name;
        }
    }

    public messageRun(args: ArgumentStream, data: proto.IWebMessageInfo, command: Command, context?: PreconditionContext | undefined): Awaitable<Result<unknown, UserError>> {
        const precondition = container.stores.get("preconditions").get(this.name);
        if (precondition) {
            return precondition.messageRun
                ? precondition.messageRun(args, data, command, { ...context, ...this.context })
                : precondition.error({
                    identifier: Identifiers.PreconditionMissingMessageHandler,
                    message: `The precondition "${precondition.name}" is missing a "messageRun" handler, but it was requested for the "${command.name}" command.`
				  });
        }
        return err(new UserError({ identifier: Identifiers.PreconditionUnavailable, message: `The precondition "${this.name}" is not available.` }));
    }
}
