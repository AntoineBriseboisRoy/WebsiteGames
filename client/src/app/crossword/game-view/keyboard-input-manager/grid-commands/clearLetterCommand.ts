import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH, Orientation } from "../../../../constants";

export class ClearLetterCommand extends AbsGridCommand {
    private letter: string;
    public constructor(cells: Array<ICell>) {
        super(cells);
    }
    public execute(): void {
        FocusCell.Instance.Cell.content = undefined;
        FocusCell.Instance.Cell = FocusCell.Instance.Cell.orientation === Orientation.Horizontal ?
        this.cells[FocusCell.Instance.Cell.gridIndex - 1] : this.cells[FocusCell.Instance.Cell.gridIndex - GRID_WIDTH];
    }
}
