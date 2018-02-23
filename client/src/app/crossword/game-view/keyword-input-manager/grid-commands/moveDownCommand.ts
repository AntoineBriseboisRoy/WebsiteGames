import { AbsGridCommand } from "./AbsGridCommand";

export class MoveDownCommand extends AbsGridCommand {
    public constructor() {
        super();
    }

    public execute(): void {
        console.log("Down");
    }
}
