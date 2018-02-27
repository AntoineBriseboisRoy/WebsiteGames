import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH, Orientation } from "../../../../constants";

export class ClearLetterCommand extends AbsGridCommand {
    public constructor(cells: Array<ICell>) {
        super(cells);
    }

    public execute(): void {
        if (FocusCell.Instance.Cell) {    // Does nothing if no cell is targeted by focus.
            if (FocusCell.Instance.Cell.content === undefined) {
                this.next();
                FocusCell.Instance.Cell.content = undefined;
            } else {
                FocusCell.Instance.Cell.content = undefined;
            }
        }
    }

    private next(): void {
        const currentGridIndex: number = FocusCell.Instance.Cell.gridIndex;
        do {
            if (FocusCell.Instance.Cell.gridIndex !== 0 && !this.isFirstCellOfSelection()) {
                FocusCell.Instance.Cell = (FocusCell.Instance.Orientation === Orientation.Horizontal) ?
                this.cells[FocusCell.Instance.Cell.gridIndex - 1] : this.cells[FocusCell.Instance.Cell.gridIndex - GRID_WIDTH];
            }
        } while (FocusCell.Instance.Cell.isFound && !this.isFirstCellOfSelection());
        if (FocusCell.Instance.Cell.isFound) {
            FocusCell.Instance.Cell = this.cells[currentGridIndex];
        }
    }

    private isFirstCellOfSelection(): boolean {
        return FocusCell.Instance.Cell === FocusCell.Instance.Cells[0];
    }
}
