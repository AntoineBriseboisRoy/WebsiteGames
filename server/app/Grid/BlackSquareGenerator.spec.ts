import { expect } from "chai";
import { BlackSquareGenerator } from "./BlackSquareGenerator";
import { STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES, BLACKSQUARE_CHARACTER } from "./Constants";
import { IWord, Orientation } from "../../../common/interfaces/IWord";

const EXTENDED_TIMEOUT: number = 5000;

describe("Verifying BlackSquare generation.", () => {
    const blacksquareGrid: BlackSquareGenerator = new BlackSquareGenerator(STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES);
    it ("Should have approximately the correct percentage of BlackSquares.", () => {
        const grid: string[][] = blacksquareGrid.Content;
        let nBlackSquares: number = 0;
        grid.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter === BLACKSQUARE_CHARACTER) {
                    ++nBlackSquares;
                }
            });
        });
        const ERROR_MARGIN: number = 0.05;
        expect(nBlackSquares).to.be.greaterThan((PERCENTAGE_BLACK_SQUARES - ERROR_MARGIN) * STANDARD_SIDE_SIZE * STANDARD_SIDE_SIZE);
        expect(nBlackSquares).to.be.lessThan((PERCENTAGE_BLACK_SQUARES + ERROR_MARGIN) * STANDARD_SIDE_SIZE * STANDARD_SIDE_SIZE);
    }).timeout(EXTENDED_TIMEOUT);
    it("Should have room for at least one word per row/column.", () => {
        const wordsToFill: IWord[] = blacksquareGrid.WordsToFill;
        const wordsInRowsCols: number[][] = new Array<Array<number>>();
        for (let i: number = 0; i < STANDARD_SIDE_SIZE; ++i) {
            wordsInRowsCols[i] = new Array<number>();
            wordsInRowsCols[i][0] = wordsInRowsCols[i][1] = 0;
        }
        for (const word of wordsToFill) {
            if (word.orientation === Orientation.Horizontal) {
                ++wordsInRowsCols[word.position.y][Orientation.Horizontal];
            } else {
                ++wordsInRowsCols[word.position.x][Orientation.Vertical];
            }
        }
        let valid: boolean = true;
        for (let i: number = 0; i < STANDARD_SIDE_SIZE; ++i) {
            if (wordsInRowsCols[i][0] === 0 || wordsInRowsCols[i][1] === 0) {
                valid = false;
            }
        }
        expect(valid).to.equal(true);
    }).timeout(EXTENDED_TIMEOUT);
    it("Should have the correct size.", () => {
        expect(blacksquareGrid.Content.length).to.equal(STANDARD_SIDE_SIZE);
        for (const array of blacksquareGrid.Content) {
            expect(array.length).to.equal(STANDARD_SIDE_SIZE);
        }
    }).timeout(EXTENDED_TIMEOUT);
});
