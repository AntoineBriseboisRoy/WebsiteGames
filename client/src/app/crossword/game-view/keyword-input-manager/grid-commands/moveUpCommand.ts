import { AbsGridCommand } from "./AbsGridCommand";

export class MoveUpCommand extends AbsGridCommand {
    public constructor() {
        super();
    }

    public execute(): void {
        console.log("Up");
    }
}
