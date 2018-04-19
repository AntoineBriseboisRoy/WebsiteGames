export class InexistantRoomError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "InexistantRoomError";
    }
}
