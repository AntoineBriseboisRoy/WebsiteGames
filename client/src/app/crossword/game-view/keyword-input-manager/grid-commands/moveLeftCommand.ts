import { AbsGridCommand } from "./AbsGridCommand";

export class MoveLeftCommand extends AbsGridCommand {
    public constructor() {
        super();
    }

    public execute(): void {
        console.log("Left");
    }
}
