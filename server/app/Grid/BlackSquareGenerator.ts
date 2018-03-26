import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { Orientation, IWord } from "../../../common/interfaces/IWord";
import { StringService } from "./StringService";
import { EMPTY_SQUARE, BLACKSQUARE_CHARACTER, MIN_LETTERS_FOR_WORD, MIN_WORDS_PER_LINE,
         MAX_WORDS_PER_LINE } from "./Constants";
export class BlackSquareGenerator {

    private grid: string[][];
    private wordsToFill: IWord[];

    public constructor(private sideSize: number, private percentageOfBlackSquares: number) {
        this.grid = this.initializeEmptyGrid();
        this.generateBlackSquares();
    }

    public get Content(): string[][] {
        return this.grid;
    }

    public get WordsToFill(): IWord[] {
        return this.wordsToFill;
    }

    private initializeEmptyGrid(): string[][] {
        const emptyGrid: string[][] = new Array();
        for (let i: number = 0; i < this.sideSize; i++) {
            emptyGrid[i] = new Array<string>();
            for (let j: number = 0; j < this.sideSize; j++) {
                emptyGrid[i][j] = EMPTY_SQUARE;
            }
        }

        return emptyGrid;
    }

    public generateBlackSquares(): void {
        if (this.sideSize <= 0) {
            return;
        }
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;
        do {
            this.grid = this.initializeEmptyGrid();

            for (let i: number = 0; i < this.sideSize; i++) {
                for (let j: number = 0; j < numberOfBlackSquaresPerLine; j++) {
                    const tempPosition: ICoordXY = this.randomPositionGenerator();
                    this.grid[tempPosition.x][tempPosition.y] = BLACKSQUARE_CHARACTER;
                }
            }
        } while (!this.verifyBlackSquareGrid());
    }

    private isOccupiedPosition(position: ICoordXY): boolean {
        return !(this.grid[position.x][position.y] === EMPTY_SQUARE);
    }

    private randomIntGenerator(): number {
        return Math.floor(Math.random() * this.sideSize);
    }

    private randomPositionGenerator(): ICoordXY {
        let tempPosition: ICoordXY = { x: Math.abs(Math.floor(this.randomIntGenerator())),
                                       y: Math.abs(Math.floor(this.randomIntGenerator())) } as ICoordXY;

        while (this.isOccupiedPosition(tempPosition)) {
            tempPosition = { x: Math.abs(Math.floor(this.randomIntGenerator())),
                             y: Math.abs(Math.floor(this.randomIntGenerator())) } as ICoordXY;
        }

        return tempPosition;
    }

    private verifyBlackSquareGrid(): boolean {
        return this.correctNumberWordsPerRowColumn() && this.allWordsConnected();
    }

    private allWordsConnected(): boolean {
        return this.breadthFirstSearch(this.getAdjacencyMatrix(this.findAllwordsToFill()));
    }

    private getAdjacencyMatrix(words: IWord[]): boolean[][] {
        const adjacencyMatrix: boolean[][] = new Array<Array<boolean>>();
        for (let i: number = 0; i < words.length; ++i) {
            adjacencyMatrix[i] = new Array<boolean>();
        }
        for (let i: number = 0; i < words.length; ++i) {
            for (let j: number = i + 1; j < words.length; ++j) {
                adjacencyMatrix[i][j] = adjacencyMatrix[j][i] = this.wordsIntersect(words[i], words[j]);
            }
        }

        return adjacencyMatrix;
    }

    private breadthFirstSearch(adjacencyMatrix: boolean[][]): boolean {
        const visited: boolean[] = new Array<boolean>();
        for (let i: number = 0; i < adjacencyMatrix.length; ++i) {
            visited[i] = false;
        }

        const queue: number[] = new Array<number>();
        queue.push(0);
        visited[0] = true;

        while (queue.length !== 0) {
            const current: number = queue.pop();
            for (let i: number = 0; i < adjacencyMatrix.length; ++i) {
                if (adjacencyMatrix[current][i] && !visited[i]) {
                    visited[i] = true;
                    queue.push(i);
                }
            }
        }

        return this.allNodesVisited(visited);
    }

    private allNodesVisited(visited: boolean[]): boolean {
        for (const iterator of visited) {
            if (!iterator) {
                return false;
            }
        }

        return true;
    }

    private wordsIntersect(firstWord: IWord, secondWord: IWord): boolean {
        if (firstWord.orientation === secondWord.orientation) {
            return false;
        }
        if (firstWord.orientation === Orientation.Horizontal) {
            return this.haveCommonPosition(firstWord, secondWord);
        } else {
            return this.haveCommonPosition(secondWord, firstWord);
        }
    }

    private haveCommonPosition(horizontalWord: IWord, verticalWord: IWord): boolean {
        return horizontalWord.position.x + horizontalWord.content.length - 1 >= verticalWord.position.x
                && horizontalWord.position.x <= verticalWord.position.x
                && verticalWord.position.y + verticalWord.content.length - 1 >= horizontalWord.position.y
                && verticalWord.position.y <= horizontalWord.position.y;
    }

    private findAllwordsToFill(): IWord[] {
        this.wordsToFill = new Array<IWord>();
        for (let i: number = 0; i < this.sideSize; ++i) {
            this.wordsToFill = this.wordsToFill.concat(this.findWordsInRow(i));
            this.wordsToFill = this.wordsToFill.concat(this.findWordsInColumn(i));
        }

        return this.wordsToFill;
    }

    private findWordsInRow(row: number): IWord[] {
        let nLettersRow: number = 0;
        const wordsToFill: IWord[] = new Array<IWord>();
        for (let i: number = 0; i < this.sideSize; ++i) {
            if (this.grid[i][row] === EMPTY_SQUARE) {
                ++nLettersRow;
            } else if (this.grid[i][row] === BLACKSQUARE_CHARACTER) {
                if (nLettersRow >= MIN_LETTERS_FOR_WORD) {
                    wordsToFill.push(this.createEmptyWord(i - nLettersRow, row,
                                                          Orientation.Horizontal, nLettersRow));
                }
                nLettersRow = 0;
            }
        }
        if (nLettersRow >= MIN_LETTERS_FOR_WORD) {
            wordsToFill.push(this.createEmptyWord(this.sideSize - nLettersRow, row,
                                                  Orientation.Horizontal, nLettersRow));

        }

        return wordsToFill;
    }

    private findWordsInColumn(column: number): IWord[] {
        let nLettersCol: number = 0;
        const wordsToFill: IWord[] = new Array<IWord>();
        for (let i: number = 0; i < this.sideSize; ++i) {
            if (this.grid[column][i] === EMPTY_SQUARE) {
                ++nLettersCol;
            } else if (this.grid[column][i] === BLACKSQUARE_CHARACTER) {
                if (nLettersCol >= MIN_LETTERS_FOR_WORD) {
                    wordsToFill.push(this.createEmptyWord(column, i - nLettersCol,
                                                          Orientation.Vertical, nLettersCol));
}
                nLettersCol = 0;
            }
        }
        if (nLettersCol >= MIN_LETTERS_FOR_WORD) {
            wordsToFill.push(this.createEmptyWord(column, this.sideSize - nLettersCol,
                                                  Orientation.Vertical, nLettersCol));
        }

        return wordsToFill;
    }

    private createEmptyWord(x: number, y: number, orientation: Orientation, length: number): IWord {
        return { position: { x: x, y: y } as ICoordXY,
                 orientation: orientation,
                 content: StringService.generateDefaultString(length),
                 definition: "" } as IWord;
    }

    private correctNumberWordsPerRowColumn(): boolean {
        let correctRatio: boolean = true;
        for (let i: number = 0; i < this.sideSize; ++i) {
            const wordsInRow: number = this.findWordsInRow(i).length;
            const wordsInColumn: number = this.findWordsInColumn(i).length;
            if (wordsInRow < MIN_WORDS_PER_LINE || wordsInRow > MAX_WORDS_PER_LINE ||
                wordsInColumn < MIN_WORDS_PER_LINE || wordsInColumn > MAX_WORDS_PER_LINE) {
                correctRatio = false;
            }
        }

        return correctRatio;
    }
}
