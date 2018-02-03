import * as cst from "./Constants";

export class StringService {

    public static eliminateSpecialChars(word: string): string {
        const specialChars: RegExp = /[ !@$%^&()_+\-=\[\]{};':"\\|,.<>\/?]/;

        return word.replace(specialChars, "");
    }

    public static replaceAccentedChars(word: string): string {
        const accentedChars: RegExp[] = [/[àÀäÄâÂ]/, /[ÉéêÊèÈëË]/, /[ïÏîÎìÌ]/, /[òÒôÔöÖ]/, /[ùÙüÜûÛ]/, /[çÇ]/];
        const replacementChars: string[] = ["A", "E", "I", "O", "U", "C"];

        for (let i: number = 0; i < accentedChars.length; i++) {
            word = word.replace(accentedChars[i], replacementChars[i]);
        }

        return word;
    }

    public static generateString(length: number): string {
        let newStr: string = "";
        for (let i: number = 0; i < length; i++) {
            newStr += (cst.EMPTY_SQUARE);
        }

        return newStr;
    }
}
