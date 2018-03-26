import { expect } from "chai";
import { BlackSquareGenerator } from "./BlackSquareGenerator";
import { STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES, BLACKSQUARE_CHARACTER, MIN_LETTERS_FOR_WORD,
         MIN_WORDS_PER_LINE } from "./Constants";

describe("Verifying BlackSquare generation.", () => {
    it ("Should have the correct percentage of BlackSquares.", () => {
        const grid: string[][] = new BlackSquareGenerator(STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES).Content;
        let nBlackSquares: number = 0;
        grid.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter === BLACKSQUARE_CHARACTER) {
                    ++nBlackSquares;
                }
            });
        });
        expect(nBlackSquares).to.equal(PERCENTAGE_BLACK_SQUARES * STANDARD_SIDE_SIZE * STANDARD_SIDE_SIZE);
    });
    // tslint:disable-next-line:max-func-body-length
    it("Should have room for at least one word per row/column.", () => {
        const grid: string[][] = new BlackSquareGenerator(STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES).Content;
        let enoughRoom: boolean = true;
        for (let i: number = 0; i < STANDARD_SIDE_SIZE; i++) {
            let previousBlackSquarePosRow: number = -1, previousBlackSquarePosCol: number = -1,
                nWordsOnRow: number = 0, nWordsOnCol: number = 0;
            for (let j: number = 0; j < STANDARD_SIDE_SIZE; j++) {
                if (grid[i][j] === BLACKSQUARE_CHARACTER) {
                    if (previousBlackSquarePosRow < j - MIN_LETTERS_FOR_WORD) {
                        ++nWordsOnRow;
                    }
                    previousBlackSquarePosRow = j;
                }
                if (grid[j][i] === BLACKSQUARE_CHARACTER) {
                    if (previousBlackSquarePosCol < j - MIN_LETTERS_FOR_WORD) {
                        ++nWordsOnCol;
                    }
                    previousBlackSquarePosCol = j;
                }
            }
            if (previousBlackSquarePosCol < grid[0].length - MIN_LETTERS_FOR_WORD) {
                ++nWordsOnCol;
            }
            if (previousBlackSquarePosRow < grid[0].length - MIN_LETTERS_FOR_WORD) {
                ++nWordsOnRow;
            }
            if ((nWordsOnCol < MIN_WORDS_PER_LINE) || (nWordsOnRow < MIN_WORDS_PER_LINE)) {
                enoughRoom = false;
            }
        }
        expect(enoughRoom).to.equal(true);
    });
});
