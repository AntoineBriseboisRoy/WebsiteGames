import { expect } from "chai";
import { Grid } from "./Grid";
import { STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES } from "./Constants";

// tslint:disable-next-line:max-func-body-length
describe.skip("Verifying letter validity.", () => {
    it ("Every letter should be capitalized.", () => {
        const testGrid: Grid = new Grid(STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES);
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
        const testGrid: Grid = new Grid(STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES);
        let specialCharFound: boolean = false;
        const specialChars: RegExp = /[!@#$%^&ÉéêÊèÈëËàÀäÄâÂòÒôÔùÙüÜûÛïÏîÎìÌçÇ()_+\-=\[\]{};':"\\|,.<>\/?]/;
        testGrid.GridContent.forEach((row: string[]) => {
            row.forEach((element: string) => {
                if (specialChars.test(element)) {
                    specialCharFound = true;
                }
            });
        });
        expect(specialCharFound).to.equal(false);
    });
    it ("Every position should be occupied.", () => {
        const testGrid: Grid = new Grid(STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES);
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
});

describe("Verifying grid difficulty.", () => {
    // Our grid does not yet have the difficulty level functionality, and we do not yet know how to test it,
    // but we know we should test it, hence the three following "empty" tests.
    it ("Should be able to generate an easy grid correctly", () => {
        expect(false).to.equal(true);
    });
    it("Should be able to generate a medium grid correctly", () => {
        expect(false).to.equal(true);
    });
    it("Should be able to generate a hard grid correctly", () => {
        expect(false).to.equal(true);
    });
});
