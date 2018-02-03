import { expect } from "chai";
import { PosXY } from "./PosXY";
import { Grid } from "./Grid";
import { BlackSquare } from "./BlackSquare";
import { Word } from "./Word";
import { DictionaryEntry, Constraint } from "./Interfaces";
import * as cst from "./Constants";

class Printer {
    public static printGrid(grid: Grid): void {
        for (let i: number = 0; i < grid.SideSize; i++) {
            const row: string = "";
            for (let j: number = 0; j < grid.SideSize; j++) {
                row.concat(grid.GridContent[i][j] + " ");
            }
            console.log(row);
        }
        console.log(grid.GridContent);
    }
}

describe("Verifying 2x2 Grid (no black squares)", () => {
    it("Should be full (4 letters)", () => {
        let nLetters: number = 0;
        const SIDE_SIZE: number = 2;
        const testGrid: Grid = new Grid(SIDE_SIZE, 0, 1);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter !== cst.EMPTY_SQUARE) {
                    ++nLetters;
                }
            });
        });
        Printer.printGrid(testGrid);
        expect(nLetters).to.equal(Math.pow(SIDE_SIZE, 2));
    });
    it("Should have 4 valid words", () => {
        const SIDE_SIZE: number = 2;
        const testGrid: Grid = new Grid(SIDE_SIZE, 0, 1);
        const nValidWords: number = 0;
        const data: DictionaryEntry[] = require("../../../dbWords.json");
        testGrid.GridContent.forEach((row: string[]) => {
            const requiredLetterPositions: Constraint[] = new Array<Constraint>();
            for (let i: number = 0; i < row[i].length; i++) {
                requiredLetterPositions.push({letter: row[i], position: i});
            }
            const searchResult: DictionaryEntry[] = data.filter((entry: DictionaryEntry) => {
                let passesFilter: boolean = true;
                if (entry.word.length <= cst.MIN_LETTERS_FOR_WORD) {
                    passesFilter = false;
                }
                requiredLetterPositions.forEach((constraint: Constraint) => {
                    if (entry.word[constraint.position] !== constraint.letter) {
                      passesFilter = false;
                    }
                });

                return passesFilter;
            });
        });
        Printer.printGrid(testGrid);
        expect(nValidWords).to.equal(4);
    });
});

describe("Verifying 3x3 Grid (no black squares)", () => {
    it("Should be full (9 letters)", () => {
        let nLetters: number = 0;
        const SIDE_SIZE: number = 3;
        const testGrid: Grid = new Grid(SIDE_SIZE, 0, 1);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter !== cst.EMPTY_SQUARE) {
                    ++nLetters;
                }
            });
        });
        Printer.printGrid(testGrid);
        expect(nLetters).to.equal(Math.pow(SIDE_SIZE, 2));
    });
    it("Should have 6 valid words", () => {
        const SIDE_SIZE: number = 3;
        const testGrid: Grid = new Grid(SIDE_SIZE, 0, 1);
        const nValidWords: number = 0;
        const data: DictionaryEntry[] = require("../../../dbWords.json");
        testGrid.GridContent.forEach((row: string[]) => {
            const requiredLetterPositions: Constraint[] = new Array<Constraint>();
            for (let i: number = 0; i < row[i].length; i++) {
                requiredLetterPositions.push({letter: row[i], position: i});
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
        });
        Printer.printGrid(testGrid);
        expect(nValidWords).to.equal(6);
    });
});

describe("Verifying 4x4 Grid (no black squares)", () => {
    it("Should be full (16 letters)", () => {
        let nLetters: number = 0;
        const SIDE_SIZE: number = 4;
        const testGrid: Grid = new Grid(SIDE_SIZE, 0, 1);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter !== cst.EMPTY_SQUARE) {
                    ++nLetters;
                }
            });
        });
        expect(nLetters).to.equal(Math.pow(SIDE_SIZE, 2));
    });
    it("Should have 8 valid words", () => {
        const SIDE_SIZE: number = 4;
        const testGrid: Grid = new Grid(SIDE_SIZE, 0, 1);
        const nValidWords: number = 0;
        const data: DictionaryEntry[] = require("../../../dbWords.json");
        testGrid.GridContent.forEach((row: string[]) => {
            const requiredLetterPositions: Constraint[] = new Array<Constraint>();
            for (let i: number = 0; i < row[i].length; i++) {
                requiredLetterPositions.push({letter: row[i], position: i});
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
        });

        expect(nValidWords).to.equal(6);
    });
});

describe("Verifying 4x4 Grid (with black squares)", () => {
    it("Should be full", () => {
        let nLetters: number = 0;
        const SIDE_SIZE: number = 4;
        const expectedNBlackSquares: number = SIDE_SIZE * SIDE_SIZE * cst.PERCENTAGE_BLACK_SQUARES;
        const testGrid: Grid = new Grid(SIDE_SIZE, 0, 1);
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                if (letter !== cst.EMPTY_SQUARE && letter !== cst.BLACKSQUARE_CHARACTER) {
                    ++nLetters;
                }
            });
        });
        expect(nLetters).to.equal(Math.pow(SIDE_SIZE, 2) - expectedNBlackSquares);
    });
    // tslint:disable-next-line:max-func-body-length
    it("Should have at least 1 valid word per row/column", () => {
        const SIDE_SIZE: number = 4;
        const testGrid: Grid = new Grid(SIDE_SIZE, cst.PERCENTAGE_BLACK_SQUARES, 1);
        const nValidWords: number = 0;
        const data: DictionaryEntry[] = require("../../../dbWords.json");
        let valid: boolean = true;

        for (let i: number = 0; i < SIDE_SIZE; i++) {
           const requiredLetterPositions: Constraint[] = new Array<Constraint>();
           for (let j: number = 0; j < SIDE_SIZE; j++) {
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

        for (let i: number = 0; i < SIDE_SIZE; i++) {
            const requiredLetterPositions: Constraint[] = new Array<Constraint>();
            for (let j: number = 0; j < SIDE_SIZE; j++) {
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

describe("Verifying Grid's BlackSquare generation.", () => {
    it ("Should create BlackSquares that are symmetrical with the diagonal.", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        let symmetrical: boolean = true;
        for (let i: number = 0; i < testGrid.SideSize; i++) {
            for (let j: number = 0; j < testGrid.SideSize; j++) {
                if (testGrid.GridContent[i][j] !== testGrid.GridContent[j][i]) {
                    symmetrical = false;
                }
            }
        }
        expect(symmetrical).to.equal(true);
      });
});

describe("Verifying words.", () => {
    it ("Every word should be valid.", () => {
        expect(false).to.equal(true);
    });
    it ("Every word should be different.", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
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
    it ("Every letter should be capitalized.", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        let lowercaseCharFound: boolean = false;
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((element: string) => {
                if (element === element.toLowerCase()) {
                    lowercaseCharFound = true;
                }
            });
        });
        expect(lowercaseCharFound).to.equal(false);
    });
    it ("There should be no special characters (accents, apostrophes, etc.)", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        let specialCharFound: boolean = false;
        const specialChars: RegExp = /[ !@#$%^&ÉéêÊèÈëËàÀäÄâÂòÒôÔùÙüÜûÛïÏîÎìÌçÇ()_+\-=\[\]{};':"\\|,.<>\/?]/;
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((element: string) => {
                if (specialChars.test(element)) {
                    specialCharFound = true;
                }
            });
        });
        expect(specialCharFound).to.equal(false);
    });
    it ("There should be no words shorter than 3 letters.", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        expect(testGrid.Words.filter((word: Word) => word.Length < cst.MIN_LETTERS_FOR_WORD).length).to.equal(0);
    });
});

describe("Verifying grid content.", () => {
    it ("Every position should be occupied.", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        let emptySpaceFound: boolean = false;
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((element: string) => {
                if (element === "") {
                    emptySpaceFound = true;
                }
            });
        });
        expect(emptySpaceFound).to.equal(false);
    });
    it ("Should be able to generate an easy grid correctly", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        expect(false).to.equal(true);
    });
    it("Should be able to generate a medium grid correctly", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        expect(false).to.equal(true);
    });
    it("Should be able to generate a hard grid correctly", () => {
        const testGrid: Grid = new Grid(10, cst.PERCENTAGE_BLACK_SQUARES, 1);
        expect(false).to.equal(true);
    });
});
