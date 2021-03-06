import { AbsCommand } from "../AbsCommand";
import { ICell } from "../../../../../../../common/interfaces/ICell";

export abstract class AbsGridCommand extends AbsCommand {
    public constructor(protected cells: Array<ICell>) {
        super();
    }

    public abstract execute(): void;
}
