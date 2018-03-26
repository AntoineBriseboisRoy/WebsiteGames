import { ICell } from "../../../../common/interfaces/ICell";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { WordTransmitterService } from "../WordTransmitterService/wordTransmitter";
import { Difficulty } from "../../../../common/constants";

export class GridInPlay {
    private gridCells: Array<ICell>;
    private gridWords: Array<IGridWord>;
    public difficulty: Difficulty;

    private static isSameWord(word1: IGridWord, word2: IGridWord): boolean {
        return word1.correctAnswer === word2.correctAnswer &&
            word1.definition === word2.definition &&
            word1.orientation === word2.orientation;
    }

    private static isSameCell(cell1: ICell, cell2: ICell): boolean {
        return cell1.gridIndex === cell2.gridIndex;
    }

    public constructor() {
        this.gridCells = new Array<ICell>();
        this.gridWords = new Array<IGridWord>();
        this.generateGrid();
    }

    public get Cells(): Array<ICell> {
        return this.gridCells;
    }

    public get Words(): Array<IGridWord> {
        return this.gridWords;
    }

    public setWordToFound(wordFound: IGridWord): void {
        for (let i: number = 0; i < this.gridWords.length; ++i) {
            if (GridInPlay.isSameWord(wordFound, this.gridWords[i])) {
                this.gridWords[i] = wordFound;
                this.gridWords[i].isFound = true;
                this.setCellsToFound(i);
            }
        }
    }

    public clear(): void {
        this.gridCells.length = 0;
        this.gridWords.length = 0;
    }

    private setCellsToFound(i: number): void {
        for (const cell of this.gridWords[i].cells) {
            const sameCell: ICell = this.gridCells.find((gridCell: ICell) => GridInPlay.isSameCell(gridCell, cell));
            if (sameCell !== undefined) {
                this.gridCells[sameCell.gridIndex] = cell;
            }
        }
    }

    private generateGrid(): void {
        this.gridCells = WordTransmitterService.Instance.getCells().slice();
        this.gridWords = WordTransmitterService.Instance.getTransformedWords().slice();
    }
}
