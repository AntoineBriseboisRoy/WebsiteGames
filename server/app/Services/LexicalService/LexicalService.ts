import * as requestPromise from "request-promise-native";
import * as fs from "file-system";
import { WordAndDefinition } from "./WordAndDefinition";

const EASY: number = 5;
const MEDIUM: number = 1;
const HARD: number = 0;

export class LexicalService {
    private requestResult: JSON;
    private options = {
        method: 'GET',
        uri: "https://api.datamuse.com/words",
        qs: {
            sp: "", //-> uri + "?sp=word"
            md: "df"
        },
        json: true,  // automatically parse data to JSON format
        simple: true // should request promise for status code other than 2xx
    };

    private sendGetRequest(searchedTemplate:string) {
        this.options.qs.sp = searchedTemplate;
        return requestPromise(this.options)
            .then((data: JSON) => {
                if(Object.keys(data).length === 0)
                    throw new Error("Il n'existe aucun mot pour cette requete"); 
                this.requestResult = data;
                return data;
            },(reject: Error) => {
                throw reject;
            })
            .catch((error: Error) => {
                console.log(error.message); 
        });
    }

    private hasDefinition(index: number): boolean{
        return this.requestResult[index].hasOwnProperty("defs");
    }

    private isInFrequencyInterval(difficulty: number, wordFrequency: number): boolean{
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
        const BEG_FRQ_STR = 2, END_FRQ_STR = 6;
        try{
            let wordFrequency: number = parseFloat(this.requestResult[index].tags[0].substr(BEG_FRQ_STR, END_FRQ_STR));
            return (this.isInFrequencyInterval(difficulty, wordFrequency));         
        }catch(err){throw err};
    }

    private filterWords (difficulty : number): Array<WordAndDefinition> {
        let result: Array<WordAndDefinition> = new Array<WordAndDefinition>();
        const LENGTH = Object.keys(this.requestResult).length;
        try{
            for( let i:number = 0; i < LENGTH; i++) {
                if(this.hasDefinition(i) && this.isValidDifficulty(i, difficulty)){
                    result.push(new WordAndDefinition(this.requestResult[i]));
                }
            }
        }catch(err){console.log(err.message); throw err;};

        return result;
    }

    public async searchWord(searchedTemplate: string, difficulty: number): Promise<Array<WordAndDefinition>> {
        await this.sendGetRequest(searchedTemplate)
        return this.filterWords(difficulty);
    }
}


//Main Shizzle: 
let service: LexicalService = new LexicalService();
let result: Array<WordAndDefinition> = new Array<WordAndDefinition>();

async function pomme() {
    let x;
    console.log(await service.searchWord("a?d?????", HARD));
}
pomme();