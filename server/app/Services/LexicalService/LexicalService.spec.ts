import { expect } from "chai";
import { LexicalService, Difficulty } from "./LexicalService";

describe("Verifying LexicalService's constructor.", () => {
    it ("Empty string should return an empty array of WordAndDefinition", () => {
        const testService: LexicalService = new LexicalService();
        expect(testService.searchWords("", Difficulty.EASY)).to.equal({});
    });
});

/*
    Tester string vide
    Tester mauvais type
    Tester mauvaise difficulté
    Tester mauvais caractères dans string
    Tester bonne requête avec ?
    Tester mauvaise requête avec ?
*/
