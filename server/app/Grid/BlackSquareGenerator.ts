import { BlackSquare } from "./BlackSquare";
import { CoordXY } from "./CoordXY";
import * as cst from "./Constants";
import { Orientation, Word } from "./Word";
import { StringService } from "./StringService";
export class BlackSquareGenerator {

    private static instance: BlackSquareGenerator;
    private blackSquares: BlackSquare[];
    private grid: string[][];
    private nTotalWords: number;
    private connectedWordsFound: Word[];

    private constructor(private sideSize: number, private percentageOfBlackSquares: number) {
        this.blackSquares = new Array<BlackSquare>();
        this.grid = this.initializeEmptyGrid();
    }

    public static getInstance(sideSize: number, percentageOfBlackSquares: number): BlackSquareGenerator {
        if (this.mustCreateNewInstance(sideSize, percentageOfBlackSquares)) {
            this.instance = new BlackSquareGenerator(sideSize, percentageOfBlackSquares);
        }

        return this.instance;
    }

    private static mustCreateNewInstance(sideSize: number, percentageOfBlackSquares: number): boolean {
        return this.instance === null || this.instance === undefined || this.instance.sideSize !== sideSize ||
               this.instance.percentageOfBlackSquares !== percentageOfBlackSquares;
    }

    private initializeEmptyGrid(): string[][] {
        const emptyGrid: string[][] = new Array();
        for (let i: number = 0; i < this.sideSize; i++) {
            emptyGrid[i] = new Array<string>();
            for (let j: number = 0; j < this.sideSize; j++) {
                emptyGrid[i][j] = cst.EMPTY_SQUARE;
            }
        }

        return emptyGrid;
    }

    public generateBlackSquares(): string[][] {
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;
        do {
            this.grid = this.initializeEmptyGrid();

            for (let i: number = 0; i < this.sideSize; i++) {
                for (let j: number = 0; j < numberOfBlackSquaresPerLine; j++) {
                    const tempPosition: CoordXY = this.randomPositionGenerator();
                    this.blackSquares.push(new BlackSquare(tempPosition));
                    this.grid[tempPosition.X][tempPosition.Y] = cst.BLACKSQUARE_CHARACTER;
                }
            }
        } while (!this.verifyBlackSquareGrid());

        return this.grid;
    }

    private isOccupiedPosition(position: CoordXY): boolean {
        return !(this.grid[position.X][position.Y] === cst.EMPTY_SQUARE);
    }

    private randomIntGenerator(): number {
        return Math.floor(Math.random() * this.sideSize);
    }

    private randomPositionGenerator(): CoordXY {
        let tempPosition: CoordXY = new CoordXY(this.randomIntGenerator(), this.randomIntGenerator());

        while (this.isOccupiedPosition(tempPosition)) {
            tempPosition = new CoordXY(this.randomIntGenerator(), this.randomIntGenerator());
        }

        return tempPosition;
    }

    private verifyBlackSquareGrid(): boolean {
        return this.correctBlackSquareRatio() && this.correctNumberWordsPerRowColumn() && this.allWordsConnected();
    }

    private allWordsConnected(): boolean {
        return (this.countConnectedWords() === this.nTotalWords);
    }

    private findFirstWord(): { coord: CoordXY, direction: Orientation } {
        for (let i: number = 0; i < this.sideSize; ++i) {
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    let nLettersRow: number = 0;
                    while (++nLettersRow + j < this.sideSize && this.grid[i][j + nLettersRow] === cst.EMPTY_SQUARE) {
                        if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD - 1) {
                            return { coord: new CoordXY(i, j), direction: Orientation.Vertical };
                        }
                    }
                    let nLettersCol: number = 0;
                    while (++nLettersCol + i < this.sideSize && this.grid[i + nLettersCol][j] === cst.EMPTY_SQUARE) {
                        if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD - 1) {
                            return { coord: new CoordXY(i, j), direction: Orientation.Horizontal };
                        }
                    }
                }
            }
        }

        return { coord: new CoordXY(0, 0), direction: Orientation.Horizontal };
    }

    private countConnectedWords(): number {
        this.connectedWordsFound = new Array<Word>();

        return this.countConnectedWordsRecursive(this.findFirstWord());
    }

    // tslint:disable-next-line:max-func-body-length
    private countConnectedWordsRecursive(currChar: { coord: CoordXY, direction: Orientation }): number {
        if (this.charBelongsToAlreadyCheckedWord(currChar)) {
            return 0;
        }

        const charsToCheck: { coord: CoordXY, direction: Orientation }[] = new Array<{ coord: CoordXY, direction: Orientation }>();
        let nWordsConnected: number = 1;
        let currWordPosition: CoordXY, currWordLength: number = 0;

        if (currChar.direction === Orientation.Horizontal) {
            let i: number = currChar.coord.X;
            while (--i >= 0 && this.grid[i][currChar.coord.Y] === cst.EMPTY_SQUARE) {
                if (this.checkAdjacentSquares(new CoordXY(i, currChar.coord.Y), currChar.direction)) {
                    charsToCheck.push({ coord: new CoordXY(i, currChar.coord.Y), direction: Orientation.Vertical });
                }
            }
            currWordPosition = new CoordXY(i + 1, currChar.coord.Y);
            i = currChar.coord.X;
            while (++i < this.sideSize && this.grid[i][currChar.coord.Y] === cst.EMPTY_SQUARE) {
                if (this.checkAdjacentSquares(new CoordXY(i, currChar.coord.Y), currChar.direction)) {
                    charsToCheck.push({ coord: new CoordXY(i, currChar.coord.Y), direction: Orientation.Vertical });
                }
            }
            currWordLength = i - currWordPosition.X;
        } else {
            let i: number = currChar.coord.Y;
            while (--i >= 0 && this.grid[currChar.coord.X][i] === cst.EMPTY_SQUARE) {
                if (this.checkAdjacentSquares(new CoordXY(currChar.coord.X, i), currChar.direction)) {
                    charsToCheck.push({ coord: new CoordXY(currChar.coord.X, i), direction: Orientation.Horizontal });
                }
            }
            currWordPosition = new CoordXY(currChar.coord.X, i + 1);
            i = currChar.coord.Y;
            while (++i < this.sideSize && this.grid[currChar.coord.X][i] === cst.EMPTY_SQUARE) {
                if (this.checkAdjacentSquares(new CoordXY(currChar.coord.X, i), currChar.direction)) {
                    charsToCheck.push({ coord: new CoordXY(currChar.coord.X, i), direction: Orientation.Horizontal });
                }
            }
            currWordLength = i - currWordPosition.Y;
        }
        this.connectedWordsFound.push(new Word(currWordPosition, currChar.direction,
                                               StringService.generateDefaultString(currWordLength), ""));

        charsToCheck.forEach((char: { coord: CoordXY, direction: Orientation }) => {
            nWordsConnected += this.countConnectedWordsRecursive(char);
        });

        return nWordsConnected;
    }

    private charBelongsToAlreadyCheckedWord(currChar: { coord: CoordXY, direction: Orientation }): boolean {
        let alreadyConnected: boolean = false;
        this.connectedWordsFound.forEach((word: Word) => {
            if (currChar.direction === word.Orientation) {
                if (currChar.direction === Orientation.Horizontal) {
                    if (word.Position.Y === currChar.coord.Y && word.Position.X <= currChar.coord.X
                        && word.Position.X + word.Content.length >= currChar.coord.X) {
                        alreadyConnected = true;
                    }
                } else {
                    if (word.Position.X === currChar.coord.X && word.Position.Y <= currChar.coord.Y
                        && word.Position.Y + word.Content.length >= currChar.coord.Y) {
                        alreadyConnected = true;
                    }
                }
            }
        });

        return alreadyConnected;
    }

    private checkAdjacentSquares(currSquare: CoordXY, orientation: Orientation): boolean {
        if (orientation === Orientation.Vertical) {
            if (currSquare.X < this.sideSize - 1 && this.grid[currSquare.X + 1][currSquare.Y] === cst.EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Horizontal })) {
                    return true;
                }
            }
            if (currSquare.X > 0 && this.grid[currSquare.X - 1][currSquare.Y] === cst.EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Horizontal })) {
                    return true;
                }
            }
        } else {
            if (currSquare.Y < this.sideSize - 1 && this.grid[currSquare.X][currSquare.Y + 1] === cst.EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Vertical })) {
                    return true;
                }
            }
            if (currSquare.Y > 0 && this.grid[currSquare.X][currSquare.Y - 1] === cst.EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Vertical })) {
                    return true;
                }
            }
        }

        return false;
    }

    // tslint:disable-next-line:max-func-body-length
    private correctNumberWordsPerRowColumn(): boolean {
        this.nTotalWords = 0;
        let correctRatio: boolean = true;
        for (let i: number = 0; i < this.sideSize; ++i) {
            let nLettersRow: number = 0, nLettersCol: number = 0, nWordsCol: number = 0, nWordsRow: number = 0;
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    ++nLettersCol;
                } else {
                    if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                        ++nWordsCol;
                    }
                    nLettersCol = 0;
                }
                if (this.grid[j][i] === cst.EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                        ++nWordsRow;
                    }
                    nLettersRow = 0;
                }
            }
            if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                ++nWordsCol;
            }
            if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                ++nWordsRow;
            }
            if (!(nWordsRow >= cst.MIN_WORDS_PER_LINE && nWordsRow <= cst.MAX_WORDS_PER_LINE
                && nWordsCol >= cst.MIN_WORDS_PER_LINE && nWordsCol <= cst.MAX_WORDS_PER_LINE)) {
                    correctRatio = false;
            }
            this.nTotalWords += nWordsRow + nWordsCol;
        }

        return correctRatio;
    }

    private correctBlackSquareRatio(): boolean {
        for (let i: number = 0; i < this.sideSize; i++) {
            let nBlackSquaresRow: number = 0, nBlackSquaresCol: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.grid[i][j] === cst.BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresRow;
                }
                if (this.grid[j][i] === cst.BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresCol;
                }
            }
            if (this.tooManyBlackSquares(nBlackSquaresCol, nBlackSquaresRow)) {
                return false;
            }
        }

        return true;
    }

    private tooManyBlackSquares(nBlackSquaresCol: number, nBlackSquaresRow: number): boolean {
        return nBlackSquaresCol / this.sideSize > cst.MAX_BLACKSQUARE_RATIO || nBlackSquaresRow / this.sideSize > cst.MAX_BLACKSQUARE_RATIO;
    }
}
