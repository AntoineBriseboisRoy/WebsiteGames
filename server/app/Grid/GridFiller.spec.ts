import { expect } from "chai";
import { Grid } from "./Grid";
import { IWord } from "../../../common/interfaces/IWord";
import { EMPTY_SQUARE, MIN_LETTERS_FOR_WORD } from "./Constants";
import { Difficulty, Orientation } from "../../../common/constants";
import { StringService } from "./StringService";

const EXTENDED_TIMEOUT: number = 30000;

describe("Verifying 10x10 Grid", () => {
    const grid: Grid = new Grid(Difficulty.Easy);
    it("Should be full (All letters except for blacksquares)", async () => {
        await grid.fillGrid();
        let nEmptySquares: number = 0;
        const EXPECTED_EMPTY_SQUARES: number = 0;
        grid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter === EMPTY_SQUARE) {
                    ++nEmptySquares;
                }
            });
        });
        expect(nEmptySquares).to.equal(EXPECTED_EMPTY_SQUARES);
    }).timeout(EXTENDED_TIMEOUT);
    it ("Every word should be different.", async (done: MochaDone) => {
        let repeat: boolean = false;
        for (let i: number = 0; i < grid.Words.length; ++i) {
            for (let j: number = i + 1; j < grid.Words.length; ++j) {
                if (grid.Words[i] === grid.Words[j]) {
                    repeat = true;
                }
            }
        }
        expect(repeat).to.equal(false);
        done();
    });
    it ("There should be no words too short.", async (done: MochaDone) => {
        expect(grid.Words.filter((word: IWord) => word.content.length < MIN_LETTERS_FOR_WORD).length).to.equal(0);
        done();
    }).timeout(EXTENDED_TIMEOUT);
    it("Should have at least 1 word per row/column", async (done: MochaDone) => {
        const wordsInRowsCols: number[][] = new Array<Array<number>>();
        for (let i: number = 0; i < grid.SideSize; ++i) {
            wordsInRowsCols[i] = new Array<number>();
            wordsInRowsCols[i][0] = wordsInRowsCols[i][1] = 0;
        }
        for (const word of grid.Words) {
            if (word.orientation === Orientation.Horizontal) {
                ++wordsInRowsCols[word.position.y][Orientation.Horizontal];
            } else {
                ++wordsInRowsCols[word.position.x][Orientation.Vertical];
            }
        }
        let valid: boolean = true;
        for (let i: number = 0; i < grid.SideSize; ++i) {
            if (wordsInRowsCols[i][0] === 0 || wordsInRowsCols[i][1] === 0) {
                valid = false;
            }
        }
        expect(valid).to.equal(true);
        done();
    }).timeout(EXTENDED_TIMEOUT);
    it("Should have no special characters.", () => {
        for (const row of grid.GridContent) {
            for (const letter of row) {
                expect(StringService.eliminateSpecialChars(letter)).to.equal(letter);
            }
        }
    });
});
