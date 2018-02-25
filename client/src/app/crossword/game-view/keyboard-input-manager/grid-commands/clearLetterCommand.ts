import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH, Orientation } from "../../../../constants";

export class ClearLetterCommand extends AbsGridCommand {
    private letter: string;
    public constructor(cells: Array<ICell>) {
        super(cells);
    }

    private isFirstCellOfSelection(): boolean {
        return FocusCell.Instance.Cell === FocusCell.Instance.Cells[0];
    }

    private next(): void {
        if (FocusCell.Instance.Cell.gridIndex !== 0) {
            FocusCell.Instance.Cell = (FocusCell.Instance.Orientation === Orientation.Horizontal) ?
                this.cells[FocusCell.Instance.Cell.gridIndex - 1] : this.cells[FocusCell.Instance.Cell.gridIndex - GRID_WIDTH];
        }
    }
    public execute(): void {
        if (FocusCell.Instance.Cell !== undefined) {
            FocusCell.Instance.Cell.content = undefined;
            while (FocusCell.Instance.Cell.isFound && !this.isFirstCellOfSelection()) {
                this.next();

            }
        }
    }
}
