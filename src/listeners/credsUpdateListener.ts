import { Listener, ListenerOptions } from "../stores/Listener.js";
import { ApplyOptions } from "@nezuchan/decorators";

@ApplyOptions<ListenerOptions>({
    event: "creds.update",
    emitter: "_sEmitter"
})
export class CredsUpdate extends Listener {
    public async run(): Promise<any> {
        await this.container.client.authState?.saveCreds();
        this.container.client.logger.info("Credentials has been updated.");
    }
}
