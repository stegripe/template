import { pino, TransportTargetOptions } from "pino";

export interface LoggerOptions {
    name: string;
    debug: boolean;
    bindings?: () => { pid: string };
    lokiHost?: URL;
    lokiAdditionalLabels?: Record<string, string>;
}

export function createLogger(options: LoggerOptions): pino.Logger {
    const targets: TransportTargetOptions[] = [
        {
            target: "pino-pretty",
            level: options.debug ? "debug" : "info",
            options: { translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l o" }
        }
    ];

    if (options.lokiHost !== undefined) {
        targets.push({
            target: "pino-loki",
            level: options.debug ? "debug" : "info",
            options: {
                host: options.lokiHost.href,
                labels: { application: options.name, ...options.lokiAdditionalLabels }
            }
        });
    }

    const logger = pino({
        name: options.name,
        timestamp: true,
        level: options.debug ? "debug" : "info",
        // formatters: options.bindings ? { bindings: options.bindings } : undefined,
        transport: { targets }
    });
    return logger;
}
