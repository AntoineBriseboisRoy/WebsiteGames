import { expect } from "chai";
import { PosXY } from "./PosXY";
import { Grid } from "./Grid";
import { BlackSquare } from "./BlackSquare";
import { Word } from "./Word";

describe("Verifying Grid's BlackSquare generation.", () => {
    it ("Should have the correct percentage of BlackSquares.", () => {
      const testGrid: Grid = new Grid(10, 0.1);
      expect(testGrid.BlackSquares.length).to.equal(10 * 0.1);
    });
});

// How can we test private functions?
/*describe("Verifying randomIntGenerator()", () => {
    it ("Should generate different integer between 0 and sideSize every time.", () => {
        expect(false).to.equal(true);
    });
});

describe("Verifying randomPositionGenerator()", () => {
    it ("Should generate different position almost every time. Normal distribution?", () => {
        expect(false).to.equal(true);
    });
});

describe("Verifying isOccupiedPosition()", () => {
    it ("Should return true", () => {
        expect(false).to.equal(true);
    });
    it ("Should return false", () => {
        expect(false).to.equal(true);
    });
});*/

describe("Verifying words.", () => {
    it ("Every word should be valid.", () => {
        expect(false).to.equal(true);
    });
    it ("Every word should be different.", () => {
        expect(false).to.equal(true);
    });
    it ("Every letter should be capitalized.", () => {
        let lowercaseCharFound = false;
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
        const testGrid: Grid = new Grid(10, 0.15);
        let specialCharFound = false;
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
        const testGrid: Grid = new Grid(10, 0.15);
        expect(testGrid.Words.filter((word: Word) => word.Length < 3).length).to.equal(0);
    });
});

describe("Verifying grid content.", () => {
    it ("Every position should be occupied.", () => {
        const testGrid: Grid = new Grid(10, 0.15);
        let emptySpaceFound = false;
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((element: string) => {
                if (element === "") {
                    emptySpaceFound = true;
                }
            });
        });
        expect(emptySpaceFound).to.equal(false);
    });
});
