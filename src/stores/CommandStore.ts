import { AliasStore } from "@sapphire/pieces";
import { Command } from "./Command.js";

export class CommandStore extends AliasStore<Command> {
    public constructor() {
        super(Command, { name: "commands" });
    }
}