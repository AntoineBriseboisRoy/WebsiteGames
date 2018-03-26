import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../../../../../common/interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH } from "../../../../constants";
import { Orientation } from "../../../../../../../common/interfaces/IWord";

export class MoveDownCommand extends AbsGridCommand {
    public constructor(cells: Array<ICell>) {
        super(cells);
    }

    public execute(): void {
        if (FocusCell.Instance.cell) {
            const initialGridIndex: number = FocusCell.Instance.cell.gridIndex;
            do {
                if (this.isStillInSelection()) {
                    this.move();
                }
            } while (FocusCell.Instance.cell.isFound && this.canMove());
            if (FocusCell.Instance.cell.isFound) {
                FocusCell.Instance.cell = this.cells[initialGridIndex];
            }
        }
    }

    private canMove(): boolean {
        return FocusCell.Instance.cell.gridIndex < FocusCell.Instance.cells[FocusCell.Instance.cells.length - 1].gridIndex;
    }

    private move(): void {
        if (this.canMove()) {
            FocusCell.Instance.cell = this.cells[FocusCell.Instance.cell.gridIndex + GRID_WIDTH];
        }
    }

    private isStillInSelection(): boolean {
        return FocusCell.Instance.cell !== undefined && FocusCell.Instance.Orientation === Orientation.Vertical;
    }
}
