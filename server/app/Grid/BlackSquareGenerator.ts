import { BlackSquare } from "./BlackSquare";
import { CoordXY } from "./CoordXY";
import * as cst from "./Constants";

export class BlackSquareGenerator {

    private static instance: BlackSquareGenerator;
    private blackSquares: BlackSquare[];
    private grid: string[][];

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
        console.log("Generating bs");
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
            console.log(this.grid);
        } while (!this.verifyBlackSquareGrid());
        console.log("Done generating bs");

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
        return this.correctBlackSquareRatio();
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
