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

    public constructor(difficulty: Difficulty) {
        this.gridCells = new Array<ICell>();
        this.gridWords = new Array<IGridWord>();
        this.difficulty = difficulty;
    }

    public get Cells(): Array<ICell> {
        return this.gridCells;
    }

    public get Words(): Array<IGridWord> {
        return this.gridWords;
    }

    public isGridCompleted(): boolean {
        for (const word of this.gridWords) {
            if (!word.isFound) {
                return false;
            }
        }

        return true;
    }

    public async generateGrid(): Promise<void> {
        await WordTransmitterService.Instance.generateNewGrid(this.difficulty);
        this.gridCells = WordTransmitterService.Instance.Cells.slice();
        this.gridWords = WordTransmitterService.Instance.GridWords.slice();
    }

    public clear(): void {
        this.gridCells.length = 0;
        this.gridWords.length = 0;
    }

    public setWordToFound(wordFound: IGridWord): void {
        for (let i: number = 0; i < this.gridWords.length; ++i) {
            if (GridInPlay.isSameWord(wordFound, this.gridWords[i])) {
                this.gridWords[i] = wordFound;
                this.gridWords[i].isFound = true;
                this.updateGridCells(i);
            }
        }
    }

    public setWordToSelected(wordFound: IGridWord): void {
        for (let i: number = 0; i < this.gridWords.length; ++i) {
            if (GridInPlay.isSameWord(wordFound, this.gridWords[i])) {
                this.gridWords[i] = wordFound;
                this.updateGridCells(i);
            }
        }
    }

    private updateGridCells(i: number): void {
        for (const cell of this.gridWords[i].cells) {
            const sameCell: ICell = this.gridCells.find((gridCell: ICell) => GridInPlay.isSameCell(gridCell, cell));
            if (sameCell !== undefined) {
                this.gridCells[sameCell.gridIndex] = cell;
            }
        }
    }
}
