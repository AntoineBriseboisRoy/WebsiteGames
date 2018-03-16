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
        if (FocusCell.Instance.Cell !== undefined) {
            FocusCell.Instance.Cell.content = this.letter;
            const initialCell: ICell = FocusCell.Instance.Cell;
            if (!this.isLastCellOfSelection()) {
                do {
                    this.nextCell();
                } while (FocusCell.Instance.Cell.isFound && !this.isLastCellOfSelection());
            }
            this.replaceCellIfAllFound(initialCell);
        }
    }

    private replaceCellIfAllFound(cell: ICell): void {
        if (FocusCell.Instance.Cell.isFound) {
            FocusCell.Instance.Cell = cell;
        }
    }

    private nextCell(): void {
        if (FocusCell.Instance.Cell.gridIndex !== (GRID_WIDTH * GRID_WIDTH - 1)) {
            FocusCell.Instance.Cell = FocusCell.Instance.Orientation === Orientation.Horizontal ?
                this.cells[FocusCell.Instance.Cell.gridIndex + 1] : this.cells[FocusCell.Instance.Cell.gridIndex + GRID_WIDTH];
        }
    }

    private isLastCellOfSelection(): boolean {
        return FocusCell.Instance.Cell === FocusCell.Instance.Cells[FocusCell.Instance.Cells.length - 1];
    }
}
