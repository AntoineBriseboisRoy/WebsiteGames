import { PosXY } from "./PosXY";
import { BlackSquare } from "./BlackSquare";
import { Word } from "./Word";
import { Dictionary } from "./Dictionary";

const BLACKSQUARE_CHARACTER = "*"; // Should be centralized
const EMPTY_SQUARE: string = "V";
// const MIN_LETTERS_FOR_WORD: number = 2;
// const MIN_WORDS_PER_LINE: number = 1;
// const MAX_WORDS_PER_LINE: number = 2;

export class Grid {

    private gridContent: string[][];
    private blackSquares: BlackSquare[];
    private words: Word[];

    constructor(private sideSize: number, private percentageOfBlackSquares: number) {
        this.initializeEmptyGrid();
        this.generateBlackSquares();
        this.chooseWordsForGrid();
    }

    public getGridContent(): string[][] {
        return this.gridContent;
    }

    public getGridLine(lineNumber: number): string[] {
        return this.gridContent[lineNumber];
    }

    public getBlackSquares(): BlackSquare[] {
        return this.blackSquares;
    }

    public getWords(): Word[] {
        return this.words;
    }

    public get SideSize(): number {
        return this.sideSize;
    }

    private initializeEmptyGrid(): void {
        this.gridContent = new Array(this.sideSize).fill(new Array(this.sideSize).fill(EMPTY_SQUARE));
    }

    // Make sure there are not too many consecutive squares. Modify so that an unequal number of squares per line is possible.
    // blackSquares^T = blackSquares
    private generateBlackSquares(): void {
        this.blackSquares = new Array<BlackSquare>();
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;
        for (let i: number = 0; i < numberOfBlackSquaresPerLine; i++) {
            for (let j: number = 0; j < numberOfBlackSquaresPerLine; j++) {
                const tempPosition: PosXY = this.randomPositionGenerator();
                this.blackSquares.push(new BlackSquare(tempPosition));
                this.gridContent[tempPosition.X][tempPosition.Y] = BLACKSQUARE_CHARACTER;
            }
        }

        /*let nBlackSquares: number = Math.floor(this.percentageOfBlackSquares * this.sideSize * this.sideSize);
        while (nBlackSquares-- > 0) {
            const tmpPosition: PosXY = this.randomPositionGenerator();
            this.blackSquares.push(new BlackSquare(tmpPosition));
            this.gridContent[tmpPosition.getX()][tmpPosition.getY()] = BLACKSQUARE_CHARACTER;
        }

        for (let i: number = 0; i < this.sideSize; ++i) {
            let nEmptySquares: number = 0;
            let nWords: number = 0;
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.gridContent[i][j] === EMPTY_SQUARE) {
                    ++nEmptySquares;
                } else if (this.gridContent[i][j] === BLACKSQUARE_CHARACTER) {
                    if (nEmptySquares >= MIN_LETTERS_FOR_WORD) {
                        ++nWords;
                    }
                    nEmptySquares = 0;
                }
            }
            /*
            if (nWords < MIN_WORDS_PER_LINE) {
                this.fixTooFewWordsOnLine(i);
            } else if (nWords > MAX_WORDS_PER_LINE) {

            }*/
    }

    /*private fixTooFewWordsOnLine(line: number): void {

    }*/

    private randomPositionGenerator(): PosXY {
        let tempPosition: PosXY = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());

        while (this.isOccupiedPosition(tempPosition)) {
            tempPosition = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());
        }

        return tempPosition;
    }

    private isOccupiedPosition(position: PosXY): boolean {
        return !(this.gridContent[position.X][position.Y] === EMPTY_SQUARE);
    }

    private randomIntGenerator(): number {
        return Math.floor(Math.random() * this.sideSize);
    }

    private chooseWordsForGrid(): void {
        this.words = new Array<Word>();

        throw new Error("Not Implemented");
    }

    private findWordsWithConstraints(length: number, requiredLettersPositions: Dictionary<number>): Dictionary<string> {
        throw new Error("Not Implemented");

        // QUERY word DB
        // IF word found THEN
        //    add word to GridContent and to Words
        // ELSE
        //    Backtrack

        return new Dictionary<string>();
    }

    private eliminateSpecialChars(word: string): string {
        const specialChars: RegExp = /[ !@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?]/;

        return word.replace(specialChars, "");
    }

    private replaceAccentedChars(word: string): string {
        const accentedChars: RegExp[] = [/[àÀäÄâÂ]/, /[ÉéêÊèÈëË]/, /[ïÏîÎìÌ]/, /[òÒôÔöÖ]/, /[ùÙüÜûÛ]/, /[çÇ]/];
        const replacementChars: string[] = ["A", "E", "I", "O", "U", "C"];

        for (let i = 0; i < accentedChars.length; i++) {
            word = word.replace(accentedChars[i], replacementChars[i]);
        }

        return word;
    }
}
