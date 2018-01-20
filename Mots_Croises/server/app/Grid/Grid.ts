import { BlackSquare } from "./BlackSquare";
import { PosXY } from "./PosXY";
import { Word } from "./Word";

const BLACKSQUARE_CHARACTER = "*"; // Should be centralized

export class Grid {

    private gridContent: string[][];
    private blackSquares: BlackSquare[];
    private words: Word[];

    // Is it an acceptable practice to call functions in the ctor?
    constructor(private sideSize: number, private percentageOfBlackSquares: number) {
        this.generateBlackSquares();
        this.chooseWordsForGrid();
    }

    public getGridContent(): string[][] {
        return this.gridContent;
    }

    public getBlackSquares(): BlackSquare[] {
        return this.blackSquares;
    }

    public getWords(): Word[] {
        return this.words;
    }

    // Make sure there are not too many consecutive squares. Modify so that an unequal number of squares per line is possible.
    // blackSquares^T = blackSquares
    private generateBlackSquares(): void {
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;
        for (let i = 0; i < numberOfBlackSquaresPerLine; i++) {
            for (let j = 0; j < numberOfBlackSquaresPerLine; j++) {
                const tempPosition: PosXY = this.randomPositionGenerator();
                this.blackSquares.push(new BlackSquare(tempPosition));
                this.gridContent[tempPosition.X][tempPosition.Y] = BLACKSQUARE_CHARACTER;
            }
        }
    }

    private randomPositionGenerator(): PosXY {
        let tempPosition: PosXY = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());

        while (this.isOccupiedPosition(tempPosition)) {
            tempPosition = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());
        }

        return tempPosition;
    }

    private randomIntGenerator(): number {
        return Math.floor(Math.random() * this.sideSize);
    }

    // No need to verify if there are letters, as they haven't been placed yet
    private isOccupiedPosition(position: PosXY): boolean {
        let occupied = false;
        this.blackSquares.forEach((square: BlackSquare) => {
            if (square.Position.equals(position)) {
                occupied = true;
            }
        });

        return occupied;
    }

    private chooseWordsForGrid(): void { }
}
