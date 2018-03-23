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
        if (FocusCell.Instance.cell !== undefined) {
            FocusCell.Instance.cell.content = this.letter;
            const initialCell: ICell = FocusCell.Instance.cell;
            if (!this.isLastCellOfSelection()) {
                do {
                    this.nextCell();
                } while (FocusCell.Instance.cell.isFound && !this.isLastCellOfSelection());
            }
            this.replaceCellIfAllFound(initialCell);
        }
    }

    private replaceCellIfAllFound(cell: ICell): void {
        if (FocusCell.Instance.cell.isFound) {
            FocusCell.Instance.cell = cell;
        }
    }

    private nextCell(): void {
        if (FocusCell.Instance.cell.gridIndex !== (GRID_WIDTH * GRID_WIDTH - 1)) {
            FocusCell.Instance.cell = FocusCell.Instance.Orientation === Orientation.Horizontal ?
                this.cells[FocusCell.Instance.cell.gridIndex + 1] : this.cells[FocusCell.Instance.cell.gridIndex + GRID_WIDTH];
        }
    }

    private isLastCellOfSelection(): boolean {
        return FocusCell.Instance.cell === FocusCell.Instance.cells[FocusCell.Instance.cells.length - 1];
    }
}
