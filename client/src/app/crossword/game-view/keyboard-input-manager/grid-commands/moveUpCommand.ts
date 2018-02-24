import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH } from "../../../../constants";

export class MoveUpCommand extends AbsGridCommand {
    public constructor(cells: Array<ICell>) {
        super(cells);
    }

    private move(): void {
        FocusCell.Instance.Cell = (FocusCell.Instance.Cell.gridIndex < GRID_WIDTH) ?
            this.cells[FocusCell.Instance.Cell.gridIndex + GRID_WIDTH * GRID_WIDTH - GRID_WIDTH] :
            this.cells[FocusCell.Instance.Cell.gridIndex - GRID_WIDTH];
    }
    public execute(): void {
        console.log("Up");
        do {
            this.move();
        } while ( FocusCell.Instance.Cell.cellColor === "Black" );
    }
}
