import * as requestPromise from "request-promise-native";
import { RequestOptions, WordAndDefinition } from "./Interfaces";
import { STATUS_CODES } from "http";

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
                this.requestResult = data;
                if (Object.keys(data).length === 0) {
                    throw new Error("Datamuse returns nothing for that request");
                }

                return data;
            },     (reject: Error) => {
                throw reject;
            })
            .catch((error: Error) => {
                //Gérer les erreurs ici. (Erreur http et erreur Datamuse return nothing).
        });
    }

    private hasDefinition(index: number): boolean {
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
        } catch (err) { /*Gérer l'erreur ici.*/ }
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
        } catch (err) { /*Gérer l'erreur ici*/ }

        return result;
    }

    public async searchWords(searchedTemplate: string, difficulty: number): Promise<Array<WordAndDefinition>> {
        await this.sendGetRequest(searchedTemplate);

        return this.filterWords(difficulty);
    }
}
