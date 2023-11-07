/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable class-methods-use-this */
import { Piece, PieceContext, PieceOptions } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { Command } from "./Command.js";
import { Result } from "@sapphire/result";
import { UserError } from "../lib/errors/UserError.js";
import { PreconditionError } from "../lib/errors/PreconditionError.js";
import { ArgumentStream } from "@sapphire/lexure";
import { proto } from "@whiskeysockets/baileys";

export class Precondition extends Piece {
    public readonly position: number | null;

    public constructor(context: PieceContext, options: PreconditionOptions) {
        super(context, options);
        this.position = options.position ?? null;
    }

    public messageRun?(args: ArgumentStream, data: proto.IWebMessageInfo, command: Command, context?: PreconditionContext): Awaitable<Result<unknown, UserError>>;

    public error(options: Omit<PreconditionError.Options, "precondition"> = {}): Awaitable<Result<unknown, UserError>> {
        return Result.err(new PreconditionError({ precondition: this, ...options }));
    }

    public ok(): Awaitable<Result<unknown, UserError>> {
        return Result.ok();
    }
}

export interface PreconditionOptions extends PieceOptions {
    position?: number;
}

export interface PreconditionContext extends Record<PropertyKey, unknown> {
    external?: boolean;
}

export type PreconditionKeys = keyof Preconditions;
export type SimplePreconditionKeys = {
    [K in PreconditionKeys]: Preconditions[K] extends never ? K : never;
}[PreconditionKeys];
