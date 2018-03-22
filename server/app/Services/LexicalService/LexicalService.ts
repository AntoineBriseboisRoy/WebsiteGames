import * as requestPromise from "request-promise-native";
import { RequestOptions, WordAndDefinition } from "./Interfaces";

export enum Difficulty {
    EASY = 5,
    MEDIUM = 1,
    HARD = 0
}

export class LexicalService {
    private difficulty: number;
    private requestResult: JSON;
    private options: RequestOptions;

    constructor() {
        this.difficulty = null;
        this.requestResult = null;
        this.options = {
            method: "GET",
            uri: "https://api.datamuse.com/words",
            qs: {
                sp: "", // -> uri + "?sp=word"
                md: "df"
            },
            json: true,  // automatically parse data to JSON format
            simple: true // should request promise for status code other than 2xx
        };
    }
    private sendGetRequest(searchedTemplate: string): Promise<void|JSON> {
        this.options.qs.sp = searchedTemplate;

        return requestPromise(this.options).promise()
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
                console.error(error);
            });
    }

    private hasDefinition(index: number): boolean {
        const DEFINITION_PROPERTY: string = "defs";

        return this.requestResult[index].hasOwnProperty(DEFINITION_PROPERTY);
    }

    private isInFrequencyInterval(wordFrequency: number): boolean {
        switch (this.difficulty) {
            case Difficulty.EASY: // Fallthrough
            case Difficulty.MEDIUM:
                return wordFrequency >= Difficulty.EASY;
            case Difficulty.HARD:
                return (wordFrequency < Difficulty.EASY) && (wordFrequency >= Difficulty.HARD);
            default:
                throw new Error("Invalid difficulty");
        }
    }

    private isValidDifficulty(index: number): boolean {
        const BEG_FREQUENCY_STR: number = 2, END_FREQUENCY_STR: number = 6;
        try {
            const wordFrequency: number = parseFloat(this.requestResult[index].tags[0].substr(BEG_FREQUENCY_STR, END_FREQUENCY_STR));

            return (this.isInFrequencyInterval(wordFrequency));
        } catch (err) {
            console.error(err);

            return false;
        }
    }

    private getWordAndDefinition(index: number): WordAndDefinition {
        const NB_DEFS: number = this.requestResult[index].defs.length;
        let randomDefinition: number = 0;
        if (NB_DEFS !== 1) {
            randomDefinition = Math.floor((Math.random() * (NB_DEFS - 1)) + 1);
        }
        switch (this.difficulty) {
            case Difficulty.EASY:
                return {word: this.requestResult[index].word, definition: this.requestResult[index].defs[0]};
            case Difficulty.MEDIUM: // Fallthrough
            case Difficulty.HARD:
                return {word: this.requestResult[index].word, definition: this.requestResult[index].defs[randomDefinition]};
            default:
                throw new Error("Invalid Difficulty");
        }
    }

    private filterWords (): Array<WordAndDefinition> {
        const filteredWords: Array<WordAndDefinition> = new Array<WordAndDefinition>();
        const LENGTH: number = Object.keys(this.requestResult).length;
        try {
            for ( let i: number = 0; i < LENGTH; i++) {
                if (this.hasDefinition(i) && this.isValidDifficulty(i)) {
                    filteredWords.push(this.getWordAndDefinition(i));
                }
            }
        } catch (err) { console.error(err); }

        return filteredWords;
    }

    public async searchWords(searchedTemplate: string, difficulty: number): Promise<Array<WordAndDefinition>> {
        this.difficulty = difficulty;
        await this.sendGetRequest(searchedTemplate);

        return this.filterWords();
    }
}
