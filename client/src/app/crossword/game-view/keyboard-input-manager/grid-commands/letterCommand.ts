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
            if (!this.isLastCellOfSelection()) {
                do {
                    this.next();
                } while (FocusCell.Instance.Cell.isFound);
            }
            if (this.isGoodAnswer()) {
                FocusCell.Instance.Cells.forEach((cell: ICell) => {
                    cell.isFound = true;
                });
                FocusCell.Instance.Cell = undefined;
                FocusCell.Instance.Cells = [];
                FocusCell.Instance.Orientation = undefined;
            }
        }
    }

    private isLastCellOfSelection(): boolean {
        return FocusCell.Instance.Cell === FocusCell.Instance.Cells[FocusCell.Instance.Cells.length - 1];
    }

    private next(): void {
        if (FocusCell.Instance.Cell.gridIndex !== (GRID_WIDTH * GRID_WIDTH - 1)) {
            FocusCell.Instance.Cell = FocusCell.Instance.Orientation === Orientation.Horizontal ?
                this.cells[FocusCell.Instance.Cell.gridIndex + 1] : this.cells[FocusCell.Instance.Cell.gridIndex + GRID_WIDTH];
        }
    }

    private isGoodAnswer(): boolean {
        let userAnswer: string = "";
        let correctAnswer: string = "";

        FocusCell.Instance.Cells.forEach((cell: ICell) => {
            userAnswer += cell.content;
        });

        FocusCell.Instance.Cells.forEach((cell: ICell) => {
            correctAnswer += cell.answer;
        });

        return userAnswer === correctAnswer;
    }
}
