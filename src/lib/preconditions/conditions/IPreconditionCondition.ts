import { ArgumentStream } from "@sapphire/lexure";
import { proto } from "@whiskeysockets/baileys";
import { IPreconditionContainer, PreconditionContainerReturn } from "../IPreconditionContainer.js";
import { PreconditionContext } from "../../../stores/Precondition.js";
import { Command } from "../../../stores/Command.js";

export interface IPreconditionCondition {
    messageSequential: (
        args: ArgumentStream,
        data: proto.IWebMessageInfo,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    messageParallel: (
        args: ArgumentStream,
        data: proto.IWebMessageInfo,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;
}
