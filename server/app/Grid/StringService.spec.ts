import * as cst from "./Constants";
import { StringService } from "./StringService";
import { expect } from "chai";

describe("Verifying the elimination of special characters", () => {
    it("Should eliminate every special char", () => {
        const initialString: string = " !@$%^&h()_+\-e=\[\]l{};'l:o\\|,.<>\/?";
        const EXPECTED_STRING: string = "hello";
        const cleanString: string = StringService.eliminateSpecialChars(initialString);

        expect(cleanString).to.equal(EXPECTED_STRING);
    });
});
describe("Verifying the correction of accented characters", () => {
    it("Should replace accented characters by their non-accented version", () => {
        const initialString: string = "çÉÀÔûéè";
        const EXPECTED_STRING: string = "CEAOUEE";
        const cleanString: string = StringService.replaceAccentedChars(initialString);

        expect(cleanString).to.equal(EXPECTED_STRING);
    });
});
describe("Verifying the generation of default strings", () => {
    it("Should create a string of correct length", () => {
        const STRING_LENGTH: number = 10;
        const generatedString: string = StringService.generateDefaultString(STRING_LENGTH);

        console.log(generatedString);
        expect(generatedString.length).to.equal(STRING_LENGTH);
    });
    it("Should create a string with only EMPTY_SQUAREs", () => {
        const STRING_LENGTH: number = 10;
        const generatedString: string = StringService.generateDefaultString(STRING_LENGTH);
        let everyLetterValid: boolean = true;

        for(let i: number = 0; i < generatedString.length; ++i) {
            if (generatedString[i] !== cst.EMPTY_SQUARE) {
                everyLetterValid = false;
            }
        }

        expect(everyLetterValid).to.equal(true);
    });
});
