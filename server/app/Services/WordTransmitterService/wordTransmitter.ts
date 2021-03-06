import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { ICell, CellColor, Finder } from "../../../../common/interfaces/ICell";
import { IWord } from "../../../../common/interfaces/IWord";
import { Orientation, Difficulty } from "../../../../common/constants";
import { GridGeneratorService } from "../../Grid/GridGeneratorService";
import { STANDARD_SIDE_SIZE, BLACKSQUARE_CHARACTER } from "../../Grid/Constants";

export class WordTransmitterService {
    private indexPosition: number[];
    private cells: Array<ICell>;
    private gridWords: Array<IGridWord>;
    private gridContent: string;
    private words: Array<IWord>;

    public constructor() {
        this.indexPosition = new Array();
        this.cells = new Array();
        this.gridWords = new Array<IGridWord>(0);
        this.words = new Array<IWord>();
        this.gridContent = undefined;
    }

    public async generateNewGrid(difficulty: Difficulty): Promise<void> {
        const gridGenerator: GridGeneratorService = new GridGeneratorService();
        await gridGenerator.createGrid(difficulty);
        this.gridContent = gridGenerator.Grid;
        this.words = gridGenerator.Words;
        this.cells.length = 0;
        this.gridWords.length = 0;
        this.formatGrid();
    }

    public get GridWords(): Array<IGridWord> {
        return this.gridWords;
    }

    public get Cells(): Array<ICell> {
        return this.cells;
    }

    private formatGrid(): void {
        this.addIndextoCells();
        this.createCells();
        this.createWords();
    }

    private isABlackSquare(letter: string): boolean {
        return letter === BLACKSQUARE_CHARACTER;
    }

    private createCells(): void {
        let index: number = 1;
        for (let i: number = 0; i < this.gridContent.length; ++i) {
            if (i === this.indexPosition[index - 1]) {
                this.cells.push({
                    gridIndex: i, index: index, answer: this.gridContent[i], cellColor: CellColor.White,
                    content: "", isFound: false, finder: Finder.nobody
                } as ICell);
                ++index;
            } else {
                if (this.gridContent[i] === BLACKSQUARE_CHARACTER) {
                    this.cells.push({
                        gridIndex: i, index: null, answer: "", cellColor: CellColor.Black,
                        content: "", isFound: false, finder: Finder.nobody
                    } as ICell);
                } else {
                    this.cells.push({
                        gridIndex: i, index: null, answer: this.gridContent[i], cellColor: CellColor.White,
                        content: "", isFound: false, finder: Finder.nobody
                    } as ICell);
                }
            }
        }
    }

    private addIndextoCells(): void {
        this.indexPosition.length = 0;
        for (let i: number = 0; i < this.gridContent.length; ++i) {
            if (this.containsIndex(i)) {
                this.indexPosition.push(i);
            }
        }
    }

    private containsIndex(i: number): boolean {
        return !this.isABlackSquare(this.gridContent[i]) &&
            (this.isFirstLineIndex(i) ||
                this.isRightToBlackSquare(i) ||
                this.isBelowBlackSquare(i) ||
                this.isFirstColumnIndex(i));
    }

    private isFirstLineIndex(i: number): boolean {
        return i < STANDARD_SIDE_SIZE && !this.isABlackSquare(this.gridContent[i + STANDARD_SIDE_SIZE]);
    }

    private isRightToBlackSquare(i: number): boolean {
        return this.isABlackSquare(this.gridContent[i - 1]) && !this.isABlackSquare(this.gridContent[i + 1]);
    }

    private isBelowBlackSquare(i: number): boolean {
        return this.isABlackSquare(this.gridContent[i - STANDARD_SIDE_SIZE]) &&
            !this.isABlackSquare(this.gridContent[i + STANDARD_SIDE_SIZE]) &&
            i < STANDARD_SIDE_SIZE * STANDARD_SIDE_SIZE - STANDARD_SIDE_SIZE;
    }

    private isFirstColumnIndex(i: number): boolean {
        return i % STANDARD_SIDE_SIZE === 0 && !this.isABlackSquare(this.gridContent[i + 1]);
    }

    private createWords(): void {
        let wordCells: Array<ICell> = new Array();
        this.words.forEach((word: IWord, index: number) => {
            const startPosition: number = this.convertPositionToCellIndex(word.position.x, word.position.y);
            if (word.orientation === Orientation.Vertical) {
                for (let i: number = startPosition, j: number = 0; j < word.content.length; i = i + STANDARD_SIDE_SIZE, j++) {
                    wordCells.push(this.cells[i]);
                }
            } else {
                for (let i: number = startPosition; i < word.content.length + startPosition; i++) {
                    wordCells.push(this.cells[i]);
                }
            }
            this.gridWords.push({
                cells: wordCells, correctAnswer: word.content.toUpperCase(),
                definition: word.definition, orientation: word.orientation, isFound: false
            } as IGridWord);
            wordCells = [];
        });
    }

    private convertPositionToCellIndex(x: number, y: number): number {
        return (y * STANDARD_SIDE_SIZE + x);
    }
}
