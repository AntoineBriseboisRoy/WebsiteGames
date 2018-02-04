import * as requestPromise from "request-promise-native";
import * as fs from "file-system";
import { RequestOptions, WordAndDefinition } from "./Interfaces";

export enum Difficulty {
    EASY = 5,
    MEDIUM = 1,
    HARD = 0
}

export class LexicalService {
    private requestResult: JSON;
    private options: RequestOptions =
     {
        method: "GET",
        uri: "https://api.datamuse.com/words",
        qs: {
            sp: "", // -> uri + "?sp=word"
            md: "df"
        },
        json: true,  // automatically parse data to JSON format
        simple: true // should request promise for status code other than 2xx
    };
    private sendGetRequest(searchedTemplate: string): Promise<void|JSON> {
        this.options.qs.sp = searchedTemplate;

        return requestPromise(this.options)
            .then( (data: JSON) => {
                if (Object.keys(data).length === 0) {
                    throw new Error("Il n'existe aucun mot pour cette requete");
                }
                this.requestResult = data;

                return data;
            },     (reject: Error) => {
                throw reject;
            })
            .catch((error: Error) => {
                console.log(error.message);
        });
    }

    private hasDefinition(index: number): boolean{
        return this.requestResult[index].hasOwnProperty("defs");
    }

    private isInFrequencyInterval(difficulty: number, wordFrequency: number): boolean {
        switch (difficulty) {
            case Difficulty.EASY: // Fallthrough
            case Difficulty.MEDIUM:
                return wordFrequency >= Difficulty.EASY;
            case Difficulty.HARD:
                return (wordFrequency < Difficulty.EASY) && (wordFrequency >= Difficulty.HARD);
            default:
                throw new Error("Invalid difficulty");
        }
    }

    private isValidDifficulty(index: number, difficulty: number): boolean{
        const BEG_FRQ_STR: number = 2, END_FRQ_STR: number = 6;
        try {
            const wordFrequency: number = parseFloat(this.requestResult[index].tags[0].substr(BEG_FRQ_STR, END_FRQ_STR));

            return (this.isInFrequencyInterval(difficulty, wordFrequency));
        } catch (err) { throw err; }
    }

    private getWordAndDefinition(index: number, difficulty: number): WordAndDefinition {
        const NB_DEFS: number = this.requestResult[index].defs.length;
        let randomDef: number = 0;
        if (NB_DEFS !== 1) {
            randomDef = Math.floor((Math.random() * (NB_DEFS - 1)) + 1);
        }
        switch (difficulty) {
            case Difficulty.EASY:
                return {word: this.requestResult[index].word, definition: this.requestResult[index].defs[0]};
            case Difficulty.MEDIUM: // Fallthrough
            case Difficulty.HARD:
                return {word: this.requestResult[index].word, definition: this.requestResult[index].defs[randomDef]};
            default:
                throw new Error("Invalid Difficulty");
        }
    }

    private filterWords (difficulty: number): Array<WordAndDefinition> {
        const result: Array<WordAndDefinition> = new Array<WordAndDefinition>();
        const LENGTH: number = Object.keys(this.requestResult).length;
        try {
            for ( let i: number = 0; i < LENGTH; i++) {
                if (this.hasDefinition(i) && this.isValidDifficulty(i, difficulty)) {
                    result.push(this.getWordAndDefinition(i, difficulty));
                }
            }
        } catch (err) { throw err; }

        return result;
    }

    public async searchWords(searchedTemplate: string, difficulty: number): Promise<Array<WordAndDefinition>> {
        await this.sendGetRequest(searchedTemplate);

        return this.filterWords(difficulty);
    }
}

const service: LexicalService = new LexicalService();
service.searchWords("p?e???t", Difficulty.MEDIUM).then((result: Array<WordAndDefinition>) => {
    console.log(result);
});
