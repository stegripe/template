import { prefix } from "./constants/config.js";
import { BotClient } from "./structures/BotClient.js";

const client = new BotClient({
    fetchPrefix() { // This could be async and also take "msg" params.
        return prefix;
    }
});

void client.login();

process.on("warning", warn => client.logger.warn(warn, "NODEJS_WARNING:"));
process.on("exit", code => client.logger.info(`NodeJS process exited with code ${code}`));
process.on("unhandledRejection", e => {
    if (e instanceof Error) {
        client.logger.error(e);
    } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        client.logger.error(Error(`PromiseError: ${e}`));
    }
});

process.on("uncaughtException", e => {
    client.logger.fatal(e);
    process.exit(1);
});
