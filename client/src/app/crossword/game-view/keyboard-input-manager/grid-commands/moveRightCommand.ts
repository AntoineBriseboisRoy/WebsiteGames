import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH } from "../../../../constants";

export class MoveRightCommand extends AbsGridCommand {
    public constructor(cells: Array<ICell>) {
        super(cells);
    }

    private move(): void {
        FocusCell.Instance.Cell = (FocusCell.Instance.Cell.gridIndex === (GRID_WIDTH * GRID_WIDTH - 1) ?
            this.cells[0] :
            this.cells[FocusCell.Instance.Cell.gridIndex + 1]);
    }
    public execute(): void {
        console.log("Right");
        do {
            this.move();
        } while ( FocusCell.Instance.Cell.cellColor === "Black" );
    }
}
