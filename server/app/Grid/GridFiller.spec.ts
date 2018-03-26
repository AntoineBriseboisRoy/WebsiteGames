import { expect } from "chai";
import { Grid } from "./Grid";
import { IWord } from "../../../common/interfaces/IWord";
import { DictionaryEntry, Constraint } from "./Interfaces";
import * as cst from "./Constants";

describe("Verifying 2x2 Grid (no black squares)", () => {
    it("Should be full (4 letters)", () => {
        let nLetters: number = 0;
        const SIDE_SIZE: number = 2, BLACK_SQUARE_RATIO: number = 0, SQUARE: number = 2;
        const testGrid: Grid = new Grid(SIDE_SIZE, BLACK_SQUARE_RATIO);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter !== cst.EMPTY_SQUARE && letter !== cst.BLACKSQUARE_CHARACTER) {
                    ++nLetters;
                }
            });
        });
        expect(nLetters).to.equal(Math.pow(SIDE_SIZE, SQUARE));
    });
    it("Should have 4 valid words", () => {
        const SIDE_SIZE: number = 2, BLACK_SQUARE_RATIO: number = 0;
        const testGrid: Grid = new Grid(SIDE_SIZE, BLACK_SQUARE_RATIO);
        const EXPECTED_VALID_WORDS: number = 4;
        let nValidWords: number = 0;
        testGrid.Words.forEach((word: IWord) => {
            const searchResult: DictionaryEntry[] = cst.DICTIONNARY.filter((entry: DictionaryEntry) => {
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
    });
});

describe("Verifying 3x3 Grid (no black squares)", () => {
    it("Should be full (9 letters)", () => {
        let nLetters: number = 0;
        const SIDE_SIZE: number = 3, BLACK_SQUARE_RATIO: number = 0, SQUARE: number = 2;
        const testGrid: Grid = new Grid(SIDE_SIZE, BLACK_SQUARE_RATIO);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter !== cst.EMPTY_SQUARE && letter !== cst.BLACKSQUARE_CHARACTER) {
                    ++nLetters;
                }
            });
        });
        expect(nLetters).to.equal(Math.pow(SIDE_SIZE, SQUARE));
    });
    it("Should have 6 valid words", () => {
        const SIDE_SIZE: number = 3, BLACK_SQUARE_RATIO: number = 0;
        const testGrid: Grid = new Grid(SIDE_SIZE, BLACK_SQUARE_RATIO);
        const EXPECTED_VALID_WORDS: number = 6;
        let nValidWords: number = 0;
        testGrid.Words.forEach((word: IWord) => {
            const searchResult: DictionaryEntry[] = cst.DICTIONNARY.filter((entry: DictionaryEntry) => {
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
    });
});

describe.skip("Verifying 10x10 Grid (no black squares)", () => {
    it("Should be full (All letters except for blacksquares)", () => {
        let nEmptySquares: number = 0;
        const BLACK_SQUARE_RATIO: number = 0, EXPECTED_EMPTY_SQUARES: number = 0;
        const testGrid: Grid = new Grid(cst.STANDARD_SIDE_SIZE, BLACK_SQUARE_RATIO);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter === cst.EMPTY_SQUARE) {
                    ++nEmptySquares;
                }
            });
        });
        expect(nEmptySquares).to.equal(EXPECTED_EMPTY_SQUARES);
    });
    it("Should have only valid words", () => {
        const BLACK_SQUARE_RATIO: number = 0;
        const testGrid: Grid = new Grid(cst.STANDARD_SIDE_SIZE, BLACK_SQUARE_RATIO);
        const EXPECTED_VALID_WORDS: number = testGrid.Words.length;
        let nValidWords: number = 0;
        testGrid.Words.forEach((word: IWord) => {
            const searchResult: DictionaryEntry[] = cst.DICTIONNARY.filter((entry: DictionaryEntry) => {
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
    });
    it ("Every word should be different.", () => {
        const testGrid: Grid = new Grid(cst.STANDARD_SIDE_SIZE, cst.PERCENTAGE_BLACK_SQUARES);
        let repeat: boolean = false;
        for (let i: number = 0; i < testGrid.Words.length; ++i) {
            for (let j: number = i + 1; j < testGrid.Words.length; ++j) {
                if (testGrid.Words[i] === testGrid.Words[j]) {
                    repeat = true;
                }
            }
        }
        expect(repeat).to.equal(false);
    });
    it ("There should be no words shorter than 3 letters.", () => {
        const testGrid: Grid = new Grid(cst.STANDARD_SIDE_SIZE, cst.PERCENTAGE_BLACK_SQUARES);
        expect(testGrid.Words.filter((word: IWord) => word.content.length < cst.MIN_LETTERS_FOR_WORD).length).to.equal(0);
    });
    // tslint:disable-next-line:max-func-body-length
    it("Should have at least 1 valid word per row/column", () => {
        const testGrid: Grid = new Grid(cst.STANDARD_SIDE_SIZE, cst.PERCENTAGE_BLACK_SQUARES);
        const data: DictionaryEntry[] = require("../../../bigDB.json");
        let valid: boolean = true;

        for (let i: number = 0; i < cst.STANDARD_SIDE_SIZE; i++) {
           const requiredLetterPositions: Constraint[] = new Array<Constraint>();
           for (let j: number = 0; j < cst.STANDARD_SIDE_SIZE; j++) {
                requiredLetterPositions.push({letter: testGrid.GridContent[i][j], position: j});
            }
           const searchResult: DictionaryEntry[] = data.filter((entry: DictionaryEntry) => {
                let passesFilter: boolean = true;
                if (entry.word.length !== length) {
                    passesFilter = false;
                }
                requiredLetterPositions.forEach((constraint: Constraint) => {
                    if (entry.word[constraint.position] !== constraint.letter) {
                      passesFilter = false;
                    }
                });

                return passesFilter;
            });
           valid = valid && (searchResult.length >= cst.MIN_WORDS_PER_LINE);
        }

        for (let i: number = 0; i < cst.STANDARD_SIDE_SIZE; i++) {
            const requiredLetterPositions: Constraint[] = new Array<Constraint>();
            for (let j: number = 0; j < cst.STANDARD_SIDE_SIZE; j++) {
                 requiredLetterPositions.push({letter: testGrid.GridContent[j][i], position: i});
             }
            const searchResult: DictionaryEntry[] = data.filter((entry: DictionaryEntry) => {
                 let passesFilter: boolean = true;
                 if (entry.word.length !== length) {
                     passesFilter = false;
                 }
                 requiredLetterPositions.forEach((constraint: Constraint) => {
                     if (entry.word[constraint.position] !== constraint.letter) {
                       passesFilter = false;
                     }
                 });

                 return passesFilter;
             });
            valid = valid && (searchResult.length >= cst.MIN_WORDS_PER_LINE);
         }

        expect(valid).to.equal(true);
    });
});
