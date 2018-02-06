import { expect } from "chai";
import { LexicalService, Difficulty } from "./LexicalService";
import { WordAndDefinition } from "./Interfaces";

const DIFFICULTY_ERR: number = -999;
const testService: LexicalService = new LexicalService();

describe("Verifying LexicalService's searchWords function.", () => {

    it("should return an array of WordAndDefinition", () => {
        return testService.searchWords("word", Difficulty.EASY).then((result: Array<WordAndDefinition>) => {
            expect(result).to.be.an("Array");
        });
    });

    it("should return a common word with its first definition", () => {
        return testService.searchWords("word", Difficulty.EASY).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).to.eql({word: "word", definition: "n\ta unit of language that native speakers can identify"});
        });
    });

    it("should return a common word with its random definition (not the first one)", () => {
        return testService.searchWords("work", Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: "work", definition: "n\tactivity directed toward making or doing something"});

        });
    });

    it("should return a common word with its only definition", () => {
        return testService.searchWords("jaws", Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).eql({word: "jaws", definition:
            "n\tholding device consisting of one or both of the opposing parts of a tool that close to hold an object"});
        });
    });

    it("should return nothing if the request returns only non common words.", () => {
        return testService.searchWords("aspen", Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: "aspen", definition:
            "n\tany of several trees of the genus Populus having leaves on flattened stalks so that they flutter in the lightest wind"});
            expect(result).to.eql(Array());
        });
    });

    it("should return a non-common word with the only definition of the word", () => {
        return testService.searchWords("aspe?", Difficulty.HARD).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).to.eql({word: "aspen", definition:
            "n\tany of several trees of the genus Populus having leaves on flattened stalks so that they flutter in the lightest wind"});
        });
    });

    it("should return a non-common word with its random definition (not the first one)", () => {
        return testService.searchWords("wor?", Difficulty.HARD).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: "work", definition: "n\ta unit of language that native speakers can identify"});
            expect(result[0]).to.eql({word: "wort", definition: "n\tusually used in combination: `liverwort'; `milkwort'; `whorlywort'"});
        });
    });

    it("a call to a Rest API should always return same values", async () => {
        let firstResult: Array<WordAndDefinition>;
        let secondResult: Array<WordAndDefinition>;
        const ITERATION_NUMBER: number = 5;

        for (let i: number = 0; i < ITERATION_NUMBER; i++) {
            firstResult = await testService.searchWords("wor?", Difficulty.HARD);
            secondResult = await testService.searchWords("wor?", Difficulty.HARD);
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

        return testService.searchWords("app??", DIFFICULTY_ERR).then((result: Array<WordAndDefinition>) => {
            expect(result).to.be.eql(Array());
        });
    });

});
