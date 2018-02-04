import * as requestPromise from "request-promise-native";
import * as fs from "file-system";
import { DictionaryEntry } from "./Interfaces";

const EASY: number = 5;
const MEDIUM: number = 1;
const HARD: number = 0;

export class LexicalService {
    private requestResult: JSON;
    private options = {
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
                return (wordFrequency < EASY) && (wordFrequency >= MEDIUM);
            case HARD:
                return (wordFrequency < MEDIUM) && (wordFrequency >= HARD);
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

    private filterWords (difficulty: number): Array<DictionaryEntry> {
        const result: Array<DictionaryEntry> = new Array<DictionaryEntry>();
        const LENGTH: number = Object.keys(this.requestResult).length;
        try {
            for ( let i: number = 0; i < LENGTH; i++) {
                if (this.hasDefinition(i) && this.isValidDifficulty(i, difficulty)){
                    result.push({word: this.requestResult[i].word, definition: this.requestResult[i].defs});
                }
            }
        } catch (err) { console.log(err.message); throw err; }

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
    console.log(result[4].definition[0]);
});
