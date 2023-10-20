import { ArgumentStream } from "@sapphire/lexure";
import { Result } from "@sapphire/result";
import { Awaitable } from "@sapphire/utilities";
import { proto } from "@whiskeysockets/baileys";
import { Command } from "../../stores/Command.js";
import { PreconditionContext } from "../../stores/Precondition.js";
import { UserError } from "../errors/UserError.js";

export type PreconditionContainerResult = Result<unknown, UserError>;

export type PreconditionContainerReturn = Awaitable<PreconditionContainerResult>;

export type AsyncPreconditionContainerReturn = Promise<PreconditionContainerResult>;

export interface IPreconditionContainer {
    messageRun: (args: ArgumentStream, data: proto.IWebMessageInfo, command: Command, context?: PreconditionContext) => PreconditionContainerReturn;
}
