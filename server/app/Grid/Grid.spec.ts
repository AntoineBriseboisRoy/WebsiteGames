import { expect } from "chai";
import { Grid } from "./Grid";
import { Difficulty } from "../../../common/constants";
import { LexicalService } from "../Services/LexicalService/LexicalService";
import { WordAndDefinition } from "../Services/LexicalService/Interfaces";

const EXTENDED_TIMEOUT: number = 30000;
const lexicalService: LexicalService = new LexicalService();

describe("Verifying letter validity.", () => {
    const testGrid: Grid = new Grid(Difficulty.Easy);
    it ("There should be no special characters (accents, apostrophes, etc.)", async () => {
        await testGrid.fillGrid();
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
    }).timeout(EXTENDED_TIMEOUT);
    it ("Every position should be occupied.", () => {
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

describe("Verifying generation of an EASY grid", () => {
    const grid: Grid = new Grid(Difficulty.Easy);
    it("Should be created", async () => {
        await grid.fillGrid();
        expect(grid).to.not.equal(undefined);
    });
    it("Should have all valid words for difficulty.", async () => {
        expect(await testGridDifficulty(grid, Difficulty.Easy)).to.equal(true);
    });
});

describe("Verifying generation of a MEDIUM grid", () => {
    const grid: Grid = new Grid(Difficulty.Medium);
    it("Should be created", async () => {
        await grid.fillGrid();
        expect(grid).to.not.equal(undefined);
    });
    it("Should have all valid words for difficulty.", async () => {
        expect(await testGridDifficulty(grid, Difficulty.Medium)).to.equal(true);
    });
});

describe("Verifying generation of an HARD grid", () => {
    const grid: Grid = new Grid(Difficulty.Hard);
    it("Should be created", async () => {
        await grid.fillGrid();
        expect(grid).to.not.equal(undefined);
    });
    it("Should have all valid words for difficulty.", async () => {
        expect(await testGridDifficulty(grid, Difficulty.Hard)).to.equal(true);
    });
});

const testGridDifficulty: Function =  async (grid: Grid, difficulty: Difficulty): Promise<boolean> => {
    const promises: Array<Promise<void>> = new Array<Promise<void>>();
    let valid: boolean = true;
    for (const word of grid.Words) {
        promises.push(lexicalService.searchWords(word.content, difficulty).then((results: WordAndDefinition[]) => {
            if (results.length === 0 || results[0].word !== word.content) {
                valid = false;
            }
        }));
    }
    await Promise.all(promises);

    return valid;
};
