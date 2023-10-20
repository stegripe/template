import { Result } from "@sapphire/result";
import { IPreconditionCondition } from "./IPreconditionCondition.js";
import { PreconditionContainerResult } from "../IPreconditionContainer.js";

export const PreconditionConditionOr: IPreconditionCondition = {
    async messageSequential(args, data, command, entries, context) {
        let error: PreconditionContainerResult | null = null;
        for (const child of entries) {
            const result = await child.messageRun(args, data, command, context);
            if (result.isOk()) return result;
            error = result;
        }

        return error ?? Result.ok();
    },
    async messageParallel(args, data, command, entries, context) {
        const results = await Promise.all(entries.map(entry => entry.messageRun(args, data, command, context)));

        let error: PreconditionContainerResult | null = null;
        for (const result of results) {
            if (result.isOk()) return result;
            error = result;
        }

        return error ?? Result.ok();
    }
};
