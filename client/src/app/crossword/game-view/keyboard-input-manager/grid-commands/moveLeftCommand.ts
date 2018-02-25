import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH } from "../../../../constants";
import { Orientation } from "../../../../../../../common/interfaces/IWord";

export class MoveLeftCommand extends AbsGridCommand {
    public constructor(cells: Array<ICell>) {
        super(cells);
    }
    private move(): void {
        if (FocusCell.Instance.Cell.gridIndex > FocusCell.Instance.Cells[0].gridIndex) {
            FocusCell.Instance.Cell = this.cells[FocusCell.Instance.Cell.gridIndex - 1];
        }
    }
    public execute(): void {
        if (this.isStillInSelection()) {
            this.move();
        }
    }
    private isStillInSelection(): boolean {
        return FocusCell.Instance.Cell !== undefined && FocusCell.Instance.Orientation === Orientation.Horizontal;
    }
}
