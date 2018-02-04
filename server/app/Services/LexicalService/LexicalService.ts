import * as requestPromise from "request-promise-native";
import * as fs from "file-system";
import { DictionaryEntry, RequestOptions } from "./Interfaces";

const EASY: number = 5;
const MEDIUM: number = 1;
const HARD: number = 0;

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
    private sendGetRequest(searchedTemplate: string): Promise<JSON> {
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
            case EASY:
                return wordFrequency >= EASY;
            case MEDIUM:
                return wordFrequency >= EASY;
            case HARD:
                return (wordFrequency < EASY) && (wordFrequency >= HARD);
            default:
                throw new Error("Invalid difficulty");
        }
    }

    private isValidDifficulty(index: number, difficulty: number): boolean{
        const BEG_FRQ_STR: number = 2, END_FRQ_STR: number = 6;
        try{
            const wordFrequency: number = parseFloat(this.requestResult[index].tags[0].substr(BEG_FRQ_STR, END_FRQ_STR));

            return (this.isInFrequencyInterval(difficulty, wordFrequency));
        } catch (err) { throw err; }
    }

    private createDictionnaryEntry(index: number, difficulty: number): DictionaryEntry {
        const NB_DEFS: number = this.requestResult[index].defs.length;
        let randomDef: number = 0;
        if (NB_DEFS !== 1) {
            randomDef = Math.floor((Math.random() * (NB_DEFS - 1)) + 1);
        }
        switch (difficulty) {
            case EASY:
                return {word: this.requestResult[index].word, definition: this.requestResult[index].defs[0]};
            case MEDIUM:
                return {word: this.requestResult[index].word, definition: this.requestResult[index].defs[randomDef]};
            case HARD:
                return {word: this.requestResult[index].word, definition: this.requestResult[index].defs[randomDef]};
            default:
                throw new Error("Invalid Difficulty");
        }
    }

    private filterWords (difficulty: number): Array<DictionaryEntry> {
        const result: Array<DictionaryEntry> = new Array<DictionaryEntry>();
        const LENGTH: number = Object.keys(this.requestResult).length;
        try {
            for ( let i: number = 0; i < LENGTH; i++) {
                if (this.hasDefinition(i) && this.isValidDifficulty(i, difficulty)){
                    result.push(this.createDictionnaryEntry(i, difficulty));
                }
            }
        } catch (err) { throw err; }

        return result;
    }

    public async searchWord(searchedTemplate: string, difficulty: number): Promise<Array<DictionaryEntry>> {
        await this.sendGetRequest(searchedTemplate);
        fs.writeFileSync("res.json", JSON.stringify(this.requestResult, null, 2));

        return this.filterWords(difficulty);
    }
}

const service: LexicalService = new LexicalService();
service.searchWord("a?p??", HARD).then((result: Array<DictionaryEntry>) => {
    console.log(result);
});
