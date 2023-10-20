/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable class-methods-use-this */
export class UserError extends Error {
    public readonly identifier: string;
    public readonly context: unknown;
    public constructor(options: UserError.Options) {
        super(options.message);
        this.identifier = options.identifier;
        this.context = options.context ?? null;
    }

    public override get name(): string {
        return "UserError";
    }
}

export namespace UserError {
    export interface Options {
        identifier: string;
        message?: string;
        context?: unknown;
    }
}
