import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH, Orientation } from "../../../../constants";

export class ClearLetterCommand extends AbsGridCommand {
    public constructor(cells: Array<ICell>) {
        super(cells);
    }

    public execute(): void {
        if (FocusCell.Instance.cell) {    // Does nothing if no cell is targeted by focus.
            if (FocusCell.Instance.cell.content === undefined) {
                this.nextCell();
                FocusCell.Instance.cell.content = undefined;
            } else {
                FocusCell.Instance.cell.content = undefined;
            }
        }
    }

    private nextCell(): void {
        const currentGridIndex: number = FocusCell.Instance.cell.gridIndex;
        do {
            this.moveAccordingOnOrientation();
        } while (FocusCell.Instance.cell.isFound && !this.isFirstCellOfSelection());
        if (FocusCell.Instance.cell.isFound) {
            FocusCell.Instance.cell = this.cells[currentGridIndex];
        }
    }

    private moveAccordingOnOrientation(): void {
        if (FocusCell.Instance.cell.gridIndex !== 0 && !this.isFirstCellOfSelection()) {
            FocusCell.Instance.cell = (FocusCell.Instance.Orientation === Orientation.Horizontal) ?
                this.cells[FocusCell.Instance.cell.gridIndex - 1] : this.cells[FocusCell.Instance.cell.gridIndex - GRID_WIDTH];
        }
    }

    private isFirstCellOfSelection(): boolean {
        return FocusCell.Instance.cell === FocusCell.Instance.cells[0];
    }
}
