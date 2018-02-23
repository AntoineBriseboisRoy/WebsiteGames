import { AbsGridCommand } from "./AbsGridCommand";

export class MoveRightCommand extends AbsGridCommand {
    public constructor() {
        super();
    }

    public execute(): void {
        console.log("Right");
    }
}
