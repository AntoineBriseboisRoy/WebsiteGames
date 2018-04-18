export class InvalidDifficultyError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "InvalidDifficultyError";
    }
}

export class RequestedWordError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "RequestedWordError";
    }
}
