import { expect } from "chai";
import { LexicalService, Difficulty } from "./LexicalService";
import { WordAndDefinition } from "./Interfaces";

const DIFFICULTY_ERR: number = -999;
const testService: LexicalService = new LexicalService();
const SEARCHED_TEMPLATE_1: string = "aspe?";
const SEARCHED_TEMPLATE_2: string = "wor?";
const SEARCHED_TEMPLATE_3: string = "app??";
const WORD_1: string = "word";
const WORD_2: string = "work";
const WORD_3: string = "jaws";
const WORD_4: string = "aspen";
const WORD_5: string = "wort";
const DEFINITION_1: string = "n\ta unit of language that native speakers can identify";
const DEFINITION_2: string = "n\tactivity directed toward making or doing something";
const DEFINITION_3: string = "n\tholding device consisting of one or both of the opposing parts of a tool that close to hold an object";
const DEFINITION_4: string =
"n\tany of several trees of the genus Populus having leaves on flattened stalks so that they flutter in the lightest wind";
const DEFINITION_5: string = "n\tusually used in combination: `liverwort'; `milkwort'; `whorlywort'";

describe("Verifying LexicalService's searchWords function.", () => {

    it("should return an array of WordAndDefinition", () => {
        return testService.searchWords(WORD_1, Difficulty.EASY).then((result: Array<WordAndDefinition>) => {
            expect(result).to.be.an("Array");
        });
    });

    it("should return a common word with its first definition", () => {
        return testService.searchWords(WORD_1, Difficulty.EASY).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).to.eql({word: WORD_1, definition: DEFINITION_1});
        });
    });

    it("should return a common word with its random definition (not the first one)", () => {
        return testService.searchWords(WORD_2, Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: WORD_2, definition: DEFINITION_2});
        });
    });

    it("should return a common word with its only definition", () => {
        return testService.searchWords(WORD_3, Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).eql({word: WORD_3, definition:
            DEFINITION_3});
        });
    });

    it("should return nothing if the request returns only non common words.", () => {
        return testService.searchWords(WORD_4, Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: WORD_4, definition:
            DEFINITION_4});
            expect(result).to.eql(Array());
        });
    });

    it("should return a non-common word with the only definition of the word", () => {
        return testService.searchWords(SEARCHED_TEMPLATE_1, Difficulty.HARD).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).to.eql({word: WORD_4, definition:
            DEFINITION_4});
        });
    });

    it("should return a non-common word with its random definition (not the first one)", () => {
        return testService.searchWords(SEARCHED_TEMPLATE_2, Difficulty.HARD).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: WORD_2, definition: DEFINITION_1});
            expect(result[0]).to.eql({word: WORD_5, definition: DEFINITION_5});
        });
    });

    it("a call to a Rest API should always return same values", async () => {
        let firstResult: Array<WordAndDefinition>;
        let secondResult: Array<WordAndDefinition>;
        const ITERATION_NUMBER: number = 5;

        for (let i: number = 0; i < ITERATION_NUMBER; i++) {
            firstResult = await testService.searchWords(SEARCHED_TEMPLATE_2, Difficulty.HARD);
            secondResult = await testService.searchWords(SEARCHED_TEMPLATE_2, Difficulty.HARD);
            expect(firstResult).to.eql(secondResult);
        }
    });

    it("verify that invalid requests return an empty array", () => {
        const INVALID_REQUEST: string = "/////";

        return testService.searchWords(INVALID_REQUEST, Difficulty.HARD).then((result: Array<WordAndDefinition>) => {
            expect(result).to.be.eql(Array());
        });
    });

    it("verify an invalid difficulty should return an empty array", () => {

        return testService.searchWords(SEARCHED_TEMPLATE_3, DIFFICULTY_ERR).then((result: Array<WordAndDefinition>) => {
            expect(result).to.be.eql(Array());
        });
    });

});
