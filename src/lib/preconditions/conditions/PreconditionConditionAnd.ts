import { Result } from "@sapphire/result";
import { IPreconditionCondition } from "./IPreconditionCondition.js";

export const PreconditionConditionAnd: IPreconditionCondition = {
    async messageSequential(args, data, command, entries, context) {
        for (const child of entries) {
            const result = await child.messageRun(args, data, command, context);
            if (result.isErr()) return result;
        }

        return Result.ok();
    },
    async messageParallel(args, data, command, entries, context) {
        const results = await Promise.all(entries.map(entry => entry.messageRun(args, data, command, context)));
        return results.find(res => res.isErr()) ?? Result.ok();
    }
};
