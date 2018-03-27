import { EMPTY_SQUARE } from "./Constants";

export class StringService {

    public static cleanWord(word: string): string {
        return this.eliminateSpecialChars(this.replaceAccentedChars(word));
    }

    public static eliminateSpecialChars(word: string): string {
        const specialChars: RegExp = /[ !@$%^&()_+\-=\[\]{};':"\\|,.<>\/?]/ig;

        return word.replace(specialChars, "");
    }

    public static replaceAccentedChars(word: string): string {
        const accentedChars: RegExp[] = [/[àÀäÄâÂ]/ig, /[ÉéêÊèÈëË]/ig, /[ïÏîÎìÌ]/ig, /[òÒôÔöÖ]/ig, /[ùÙüÜûÛ]/ig, /[çÇ]/ig];
        const replacementChars: string[] = ["A", "E", "I", "O", "U", "C"];

        for (let i: number = 0; i < accentedChars.length; i++) {
            word = word.replace(accentedChars[i], replacementChars[i]);
        }

        return word;
    }

    public static generateDefaultString(length: number): string {
        let newStr: string = "";
        for (let i: number = 0; i < length; i++) {
            newStr += (EMPTY_SQUARE);
        }

        return newStr;
    }
}
