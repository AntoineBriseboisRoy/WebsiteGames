import { expect } from "chai";
import { PosXY } from "./PosXY";
import { Grid } from "./Grid";
import { BlackSquare } from "./BlackSquare";
import { Word } from "./Word";

describe("Verifying Grid's BlackSquare generation.", () => {
    it ("Should have the correct percentage of BlackSquares.", () => {
      const testGrid: Grid = new Grid(10, 0.1, 1);
      expect(testGrid.BlackSquares.length).to.equal(10 * 0.1);
    });
    it ("Should create BlackSquares that are symmetrical with the diagonal.", () => {
        const testGrid: Grid = new Grid(10, 0.1, 1);
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
        const testGrid: Grid = new Grid(10, 0.17, 1);
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
        const testGrid: Grid = new Grid(10, 0.17, 1);
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
        const testGrid: Grid = new Grid(10, 0.15, 1);
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
        const testGrid: Grid = new Grid(10, 0.15, 1);
        expect(testGrid.Words.filter((word: Word) => word.Length < 3).length).to.equal(0);
    });
});

describe("Verifying grid content.", () => {
    it ("Every position should be occupied.", () => {
        const testGrid: Grid = new Grid(10, 0.15, 1);
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
        const testGrid: Grid = new Grid(10, 0.15, 1);
        expect(false).to.equal(true);
    });
    it("Should be able to generate a medium grid correctly", () => {
        const testGrid: Grid = new Grid(10, 0.15, 1);
        expect(false).to.equal(true);
    });
    it("Should be able to generate a hard grid correctly", () => {
        const testGrid: Grid = new Grid(10, 0.15, 1);
        expect(false).to.equal(true);
    });
});
