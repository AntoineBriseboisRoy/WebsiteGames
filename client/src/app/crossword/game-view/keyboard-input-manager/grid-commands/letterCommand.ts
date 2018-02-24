import { AbsGridCommand } from "./AbsGridCommand";
import { ICell } from "../../../interfaces/ICell";
import { FocusCell } from "../../focusCell";
import { GRID_WIDTH, Orientation } from "../../../../constants";

export class LetterCommand extends AbsGridCommand {
    private letter: string;
    public constructor(cells: Array<ICell>, unicode: number) {
        super(cells);
        this.letter = (String.fromCharCode(unicode));
    }
    public execute(): void {
        FocusCell.Instance.Cell.content = (this.letter);
        FocusCell.Instance.Cell = FocusCell.Instance.Cell.orientation === Orientation.Horizontal ?
        this.cells[FocusCell.Instance.Cell.gridIndex + 1] : this.cells[FocusCell.Instance.Cell.gridIndex + GRID_WIDTH];
    }
}
