/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { PrefixedStrategy } from "@sapphire/lexure";
import { Option } from "@sapphire/result";

export interface FlagStrategyOptions {
    flags?: boolean | readonly string[];
    options?: boolean | readonly string[];
    prefixes?: string[];
    separators?: string[];
}

const never = (): Option.None => Option.none;
const always = (): boolean => true;

export class FlagUnorderedStrategy extends PrefixedStrategy {
    public readonly flags: readonly string[] | true;
    public readonly options: readonly string[] | true;

    public constructor({ flags, options, prefixes = ["--", "-", "—"], separators = ["=", ":"] }: FlagStrategyOptions = {}) {
        super(prefixes, separators);
        this.flags = flags || [];
        this.options = options || [];

        if (this.flags === true) this.allowedFlag = always;
        else if (this.flags.length === 0) this.matchFlag = never;

        if (this.options === true) {
            this.allowedOption = always;
        } else if (this.options.length === 0) {
            this.matchOption = never;
        }
    }

    public override matchFlag(s: string): Option<string> {
        const result = super.matchFlag(s);

        if (result.isSomeAnd(value => this.allowedFlag(value))) return result;

        return Option.none;
    }

    public override matchOption(s: string): Option<readonly [key: string, value: string]> {
        const result = super.matchOption(s);

        if (result.isSomeAnd(option => this.allowedOption(option[0]))) return result;

        return Option.none;
    }

    private allowedFlag(s: string): boolean {
        return (this.flags as readonly string[]).includes(s);
    }

    private allowedOption(s: string): boolean {
        return (this.options as readonly string[]).includes(s);
    }
}
