import { expect } from "chai";
import { LexicalService, Difficulty } from "./LexicalService";
import { WordAndDefinition } from "./Interfaces";

const DIFFICULTY_ERR: number = -999;
const testService: LexicalService = new LexicalService();

describe("Verifying LexicalService's searchWords function.", () => {
    it("should return a common word with its first definition", () => {
        return testService.searchWords("word", Difficulty.EASY).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).to.eql({word: "word", definition: "n\ta unit of language that native speakers can identify"});
        });
    });

    it("should return a common word with its random definition (not the first one)", () => {
        return testService.searchWords("word", Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: "word", definition: "n\ta unit of language that native speakers can identify"});
        });
    });

    it("should return a common word with the only definition of the word", () => {
        return testService.searchWords("aspen", Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
            expect(result[0]).not.eql({word: "aspen", definition: "n\tany of several trees of the genus Populus having leaves on flattened stalks so that they flutter in the lightest wind"});
        });
    });
});

/*  1. Test difficulté invalide
*   2. Tests nom commun vs nom non commun selon la difficulté
*   3. Test mot invalide
*   4. Test mot valide
*   5. Test, s'il y a une seule def, la retourne
*   6. Tests def selon la difficulté
*   7. Test si aucune connection réseau
*/
