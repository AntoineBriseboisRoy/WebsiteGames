import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH } from "../../../../constants";

export class MoveDownCommand extends AbsGridCommand {
    public constructor(cells: Array<ICell>) {
        super(cells);
    }
    private move(): void {
        if (FocusCell.Instance.Cell.gridIndex < GRID_WIDTH * GRID_WIDTH - GRID_WIDTH) {
            FocusCell.Instance.Cell = this.cells[FocusCell.Instance.Cell.gridIndex + GRID_WIDTH];
        }
    }
    public execute(): void {
        console.log("Down");
        this.move();
        while ( FocusCell.Instance.Cell.cellColor === "Black" ) {
            this.move();
        }
    }
}
