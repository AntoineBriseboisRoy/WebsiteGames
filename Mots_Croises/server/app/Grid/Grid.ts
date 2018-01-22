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
        // this.gridContent = new Array<Array<string>>();
        this.gridContent = new Array(sideSize).fill(new Array(sideSize));
        this.generateBlackSquares();
        this.chooseWordsForGrid();
    }

    public get GridContent(): string[][] {
        return this.gridContent;
    }

    public get BlackSquares(): BlackSquare[] {
        return this.blackSquares;
    }

    public get Words(): Word[] {
        return this.words;
    }

    public get SideSize(): number {
        return this.sideSize;
    }

    // Make sure there are not too many consecutive squares. Modify so that an unequal number of squares per line is possible.
    // blackSquares^T = blackSquares
    private generateBlackSquares(): void {
        this.blackSquares = new Array<BlackSquare>();
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

    private chooseWordsForGrid(): void {
        this.words = new Array<Word>();
    }

    private eliminateSpecialChars(word: string): void { }
}
