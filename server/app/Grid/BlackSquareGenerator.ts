import { BlackSquare } from "./BlackSquare";
import { PosXY } from "./PosXY";
import * as cst from "./Constants";

export class BlackSquareGenerator {

    private static instance: BlackSquareGenerator;
    private blackSquares: BlackSquare[];
    private grid: string[][];

    private constructor(private sideSize: number, private percentageOfBlackSquares: number) { }

    public static getInstance(sideSize: number, percentageOfBlackSquares: number): BlackSquareGenerator {
        if (this.instance === null || this.instance.sideSize !== sideSize ||
            this.instance.percentageOfBlackSquares !== percentageOfBlackSquares) {
            this.instance = new BlackSquareGenerator(sideSize, percentageOfBlackSquares);
        }

        return this.instance;
    }

    public Generate(): string[][] {
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;
        this.blackSquares = new Array<BlackSquare>();
        this.initializeEmptyGrid();

        for (let i: number = 0; i < numberOfBlackSquaresPerLine; i++) {
            for (let j: number = 0; j < i; j++) {
                const tempPosition: PosXY = this.randomPositionGenerator();
                this.blackSquares.push(new BlackSquare(tempPosition));
                this.blackSquares.push(new BlackSquare(PosXY.invertCoordinates(tempPosition)));
                this.grid[tempPosition.X][tempPosition.Y] = cst.BLACKSQUARE_CHARACTER;
                this.grid[tempPosition.Y][tempPosition.X] = cst.BLACKSQUARE_CHARACTER;
            }
        }

        return this.grid;
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
            if (nBlackSquaresCol / this.sideSize > cst.MAX_BLACKSQUARE_RATIO ||
                nBlackSquaresRow / this.sideSize > cst.MAX_BLACKSQUARE_RATIO) {
                return false;
            }
        }

        return true;
    }

    private correctNumberWords(): boolean {
        for (let i: number = 0; i < this.sideSize; ++i) {
            let nEmptySquaresRow: number = 0, nWordsRow: number = 0, nEmptySquaresCol: number, nWordsCol: number = 0;
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    ++nEmptySquaresRow;
                } else if (this.grid[i][j] === cst.BLACKSQUARE_CHARACTER) {
                    if (nEmptySquaresRow >= cst.MIN_LETTERS_FOR_WORD) {
                        ++nWordsRow;
                    }
                    nEmptySquaresRow = 0;
                }
                if (this.grid[j][i] === cst.EMPTY_SQUARE) {
                    ++nEmptySquaresCol;
                } else if (this.grid[j][i] === cst.BLACKSQUARE_CHARACTER) {
                    if (nEmptySquaresCol >= cst.MIN_LETTERS_FOR_WORD) {
                        ++nWordsCol;
                    }
                    nEmptySquaresCol = 0;
                }
            }
            if ((nWordsRow < cst.MIN_WORDS_PER_LINE || nWordsRow > cst.MAX_WORDS_PER_LINE)
                || (nWordsCol < cst.MIN_WORDS_PER_LINE || nWordsCol > cst.MAX_WORDS_PER_LINE)) {
                return false;
            }
        }

        return true;
    }

    private initializeEmptyGrid(): void {
        this.grid = new Array();
        for (let i: number = 0; i < this.sideSize; i++) {
            this.grid[i] = new Array<string>();
            for (let j: number = 0; j < this.sideSize; j++) {
                this.grid[i][j] = cst.EMPTY_SQUARE;
            }
        }
    }

    private isOccupiedPosition(position: PosXY): boolean {
        return !(this.grid[position.X][position.Y] === cst.EMPTY_SQUARE);
    }

    private randomIntGenerator(): number {
        return Math.floor(Math.random() * this.sideSize);
    }

    private randomPositionGenerator(): PosXY {
        let tempPosition: PosXY = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());

        while (this.isOccupiedPosition(tempPosition)) {
            tempPosition = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());
        }

        return tempPosition;
    }

    private verifyBlackSquareGrid(): boolean {
        return this.correctBlackSquareRatio() && this.correctNumberWords();
    }
}
