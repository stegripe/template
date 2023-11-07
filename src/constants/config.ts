export const prefix = process.env.BOT_PREFIX!;
export const isDev = process.env.NODE_ENV === "development";
export const devs: string[] = JSON.parse(process.env.DEVS ?? "[]");

if (typeof prefix !== "string" || prefix === "") throw new Error("BOT_PREFIX can't be empty!");
