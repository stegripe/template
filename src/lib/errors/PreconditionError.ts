/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-namespace */
import { UserError } from "./UserError.js";
import { Precondition } from "../../stores/Precondition.js";

/**
 * Errors thrown by preconditions
 * @property name This will be `'PreconditionError'` and can be used to distinguish the type of error when any error gets thrown
 */
export class PreconditionError extends UserError {
    public readonly precondition: Precondition;

    public constructor(options: PreconditionError.Options) {
        super({ ...options, identifier: options.identifier ?? options.precondition.name });
        this.precondition = options.precondition;
    }

    public override get name(): string {
        return "PreconditionError";
    }
}

export namespace PreconditionError {
    export interface Options extends Omit<UserError.Options, "identifier"> {
        precondition: Precondition;
        identifier?: string;
    }
}
