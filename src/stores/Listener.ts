/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Piece, PieceContext, PieceOptions } from "@sapphire/pieces";
import { Result } from "@sapphire/result";
import { EventEmitter } from "node:events";

export abstract class Listener extends Piece {
    public emitter: EventEmitter | null;
    public event: string | symbol;
    public once: boolean;
    private _listener: ((...args: any[]) => void) | null;

    public constructor(context: PieceContext, options: ListenerOptions = {}) {
        super(context, options);

        this.emitter =
			typeof options.emitter === "undefined"
			    ? this.container.client
			    : (typeof options.emitter === "string" ? (Reflect.get(this.container.client, options.emitter) as EventEmitter) : options.emitter) ??
				  null;

        this.event = options.event ?? this.name;
        this.once = options.once ?? false;

        this._listener = this.emitter && this.event ? this.once ? this._runOnce.bind(this) : this._run.bind(this) : null;

        if (this.emitter === null || this._listener === null) this.enabled = false;
    }

    public override onLoad(): unknown {
        if (this._listener) {
            const emitter = this.emitter!;

            // Baileys emitter doesn't have this
            if ("getMaxListeners" in emitter) {
                const maxListeners = emitter.getMaxListeners();
                if (maxListeners !== 0) emitter.setMaxListeners(maxListeners + 1);
            }

            emitter[this.once ? "once" : "on"](this.event, this._listener);
        }
        return super.onLoad();
    }

    public override onUnload(): unknown {
        if (!this.once && this._listener) {
            const emitter = this.emitter!;

            // Baileys emitter doesn't have this
            if ("getMaxListeners" in emitter) {
                const maxListeners = emitter.getMaxListeners();
                if (maxListeners !== 0) emitter.setMaxListeners(maxListeners - 1);
            }

            emitter.off(this.event, this._listener);
            this._listener = null;
        }

        return super.onUnload();
    }

    private async _run(...args: unknown[]): Promise<void> {
        const result = await Result.fromAsync(() => this.run(...args));
        if (result.isErr()) {
            // this.container.client.emit(ListenerEvents.ListenerError, { listener: this, error: result.err().unwrap() });
        }
    }

    private async _runOnce(...args: unknown[]): Promise<void> {
        await this._run(...args);
        await this.unload();
    }

    public abstract run(...args: unknown[]): unknown;
}

export interface ListenerOptions extends PieceOptions {
    emitter?: EventEmitter | string;
    event?: string;
    once?: boolean;
}
