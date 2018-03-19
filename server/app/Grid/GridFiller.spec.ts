import { expect } from "chai";
import { Grid } from "./Grid";
import { IWord, Orientation } from "../../../common/interfaces/IWord";
import { DictionaryEntry, Constraint } from "./Interfaces";
import { EMPTY_SQUARE, BLACKSQUARE_CHARACTER, DICTIONNARY, STANDARD_SIDE_SIZE, MIN_LETTERS_FOR_WORD, MIN_WORDS_PER_LINE } from "./Constants";

const EXTENDED_TIMEOUT: number = 30000;

// tslint:disable-next-line:max-func-body-length
describe("Verifying 2x2 Grid (no black squares)", () => {
    it("Should be full (4 letters)", () => {
        let nLetters: number = 0;
        const SIDE_SIZE: number = 2, BLACK_SQUARE_RATIO: number = 0, SQUARE: number = 2;
        const testGrid: Grid = new Grid(SIDE_SIZE, BLACK_SQUARE_RATIO);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter !== EMPTY_SQUARE && letter !== BLACKSQUARE_CHARACTER) {
                    ++nLetters;
                }
            });
        });
        expect(nLetters).to.equal(Math.pow(SIDE_SIZE, SQUARE));
    }).timeout(EXTENDED_TIMEOUT);
    it("Should have 4 valid words", () => {
        const SIDE_SIZE: number = 2, BLACK_SQUARE_RATIO: number = 0;
        const testGrid: Grid = new Grid(SIDE_SIZE, BLACK_SQUARE_RATIO);
        const EXPECTED_VALID_WORDS: number = 4;
        let nValidWords: number = 0;
        testGrid.Words.forEach((word: IWord) => {
            const searchResult: DictionaryEntry[] = DICTIONNARY.filter((entry: DictionaryEntry) => {
                let passesFilter: boolean = true;
                if (entry.word === word.content) {
                    passesFilter = false;
                }

                return passesFilter;
            });
            if (searchResult.length > 0) {
                ++nValidWords;
            }
        });
        expect(nValidWords).to.equal(EXPECTED_VALID_WORDS);
    }).timeout(EXTENDED_TIMEOUT);
});

describe("Verifying 10x10 Grid", () => {
    it("Should be full (All letters except for blacksquares)", () => {
        let nEmptySquares: number = 0;
        const EXPECTED_EMPTY_SQUARES: number = 0;
        const testGrid: Grid = new Grid();
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter === EMPTY_SQUARE) {
                    ++nEmptySquares;
                }
            });
        });
        expect(nEmptySquares).to.equal(EXPECTED_EMPTY_SQUARES);
    }).timeout(EXTENDED_TIMEOUT);
    it("Should have only valid words", () => {
        const testGrid: Grid = new Grid();
        const EXPECTED_VALID_WORDS: number = testGrid.Words.length;
        let nValidWords: number = 0;
        testGrid.Words.forEach((word: IWord) => {
            const searchResult: DictionaryEntry[] = DICTIONNARY.filter((entry: DictionaryEntry) => {
                let passesFilter: boolean = true;
                if (entry.word === word.content) {
                    passesFilter = false;
                }

                return passesFilter;
            });
            if (searchResult.length > 0) {
                ++nValidWords;
            }
        });

        expect(nValidWords).to.equal(EXPECTED_VALID_WORDS);
    }).timeout(EXTENDED_TIMEOUT);
    it ("Every word should be different.", () => {
        const testGrid: Grid = new Grid();
        let repeat: boolean = false;
        for (let i: number = 0; i < testGrid.Words.length; ++i) {
            for (let j: number = i + 1; j < testGrid.Words.length; ++j) {
                if (testGrid.Words[i] === testGrid.Words[j]) {
                    repeat = true;
                }
            }
        }
        expect(repeat).to.equal(false);
    }).timeout(EXTENDED_TIMEOUT);
    it ("There should be no words too short.", () => {
        const testGrid: Grid = new Grid();
        expect(testGrid.Words.filter((word: IWord) => word.content.length < MIN_LETTERS_FOR_WORD).length).to.equal(0);
    }).timeout(EXTENDED_TIMEOUT);
    // tslint:disable-next-line:max-func-body-length
    it("Should have at least 1 word per row/column", () => {
        const testGrid: Grid = new Grid();
        const wordsInRowsCols: number[][] = new Array<Array<number>>();
        for (let i: number = 0; i < testGrid.SideSize; ++i) {
            wordsInRowsCols[i][0] = wordsInRowsCols[i][1] = 0;
        }
        for (const word of testGrid.Words) {
            if (word.orientation === Orientation.Horizontal) {
                ++wordsInRowsCols[word.position.y][Orientation.Horizontal];
            } else {
                ++wordsInRowsCols[word.position.x][Orientation.Vertical];
            }
        }
        let valid: boolean = true;
        for (let i: number = 0; i < testGrid.SideSize; ++i) {
            if (wordsInRowsCols[i][0] === 0 || wordsInRowsCols[i][1] === 0) {
                valid = false;
            }
        }
        expect(valid).to.equal(true);
    }).timeout(EXTENDED_TIMEOUT);
});
