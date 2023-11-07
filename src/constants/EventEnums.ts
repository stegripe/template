export enum ListenerEvents {
    ListenerError = "listenerError"
}

export enum Events {
    MessageCreate = "messageCreate",

    PreMessageParsed = "preMessageParsed",
    MentionPrefixOnly = "mentionPrefixOnly",
    NonPrefixedMessage = "nonPrefixedMessage",
    PrefixedMessage = "prefixedMessage",
    UnknownMessageCommandName = "unknownMessageCommandName",
    CommandDoesNotHaveMessageCommandHandler = "commandDoesNotHaveMessageCommandHandler",
    UnknownMessageCommand = "unknownMessageCommand",

    PossibleMessageCommand = "possibleMessageCommand",
    PreMessageCommandRun = "preMessageCommandRun",
    MessageCommandDisabled = "messageCommandDisabled",
    MessageCommandDenied = "messageCommandDenied",
    MessageCommandAccepted = "messageCommandAccepted",
    MessageCommandError = "messageCommandError",

    RegisteringCommand = "registeringCommand",
    CommandRegistered = "commandRegistered"
}
