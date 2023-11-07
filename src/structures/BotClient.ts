import { CommandStore } from "../stores/CommandStore.js";
import { PreconditionStore } from "../stores/PreconditionStore.js";
import { ListenerStore } from "../stores/ListenerStore.js";
import { makeWASocket, AuthenticationState, makeCacheableSignalKeyStore, useMultiFileAuthState, proto } from "@whiskeysockets/baileys";
import { createLogger } from "../utils/Logger.js";
import { Store, container, Piece } from "@sapphire/pieces";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import EventEmitter from "node:events";
import { isDev } from "../constants/config.js";

export class BotClient extends EventEmitter {
    public stores = container.stores;
    public socket: ReturnType<typeof makeWASocket> | undefined;

    public logger = createLogger({
        name: "Katheryne-bot",
        debug: isDev
    });

    public authState: { state: AuthenticationState; saveCreds: () => Promise<void> } | undefined;

    public constructor(public readonly options: BotClientOptions) {
        super();
        container.client = this;
    }

    public async login(): Promise<any> {
        this.authState = await useMultiFileAuthState("auth_state");
        this.socket = makeWASocket({
            auth: {
                creds: this.authState.state.creds,
                // @ts-expect-error-next-line Baileys doesn't update the pino deps.
                keys: makeCacheableSignalKeyStore(this.authState.state.keys, this.logger)
            },
            printQRInTerminal: true,
            // @ts-expect-error-next-line Baileys doesn't update the pino deps.
            logger: this.logger
        });

        Object.assign(this, {
            _sEmitter: this.socket.ev
        });

        const currentDir = dirname(fileURLToPath(import.meta.url));
        this.stores
            .register(new ListenerStore()
                .registerPath(resolve(currentDir, "..", "listeners")))
            .register(new CommandStore())
            .register(new PreconditionStore()
                .registerPath(resolve(currentDir, "..", "preconditions")));

        this.stores.registerPath(this.options.baseUserDirectory);

        await Promise.all([...this.stores.values()].map((store: Store<Piece>) => store.unloadAll()));
        await Promise.all([...this.stores.values()].map((store: Store<Piece>) => store.loadAll()));
    }
}

declare module "@sapphire/pieces" {
    interface Container {
        client: BotClient;
    }

    interface StoreRegistryEntries {
        commands: CommandStore;
        listeners: ListenerStore;
        preconditions: PreconditionStore;
    }
}

export interface BotClientOptions {
    baseUserDirectory?: string;
    fetchPrefix: (msg: proto.IWebMessageInfo) => string;
}
