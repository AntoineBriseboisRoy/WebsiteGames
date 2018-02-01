import * as requestPromise from "request-promise-native";
import * as fs from "file-system";
import { WordAndDefinition } from "./WordAndDefinition";

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

    constructor(){};

    private sendGetRequest(searchedTemplate:string) {
        this.options.qs.sp = searchedTemplate;
        return requestPromise(this.options)
            .then((data: JSON) => {
                if(Object.keys(data).length === 0)
                    throw new Error("Il n'existe aucun mot pour cette requete"); 
                this.requestResult = data;
            },(reject: Error) => {
                throw reject;
            })
            .catch((error: Error) => {
                console.log(error.message); 
        });
    }

    /*  TO DO:
    *   1. Ajouter les mots valides au tableau result
    *   2. Ajouter les mots au tableau result selon la difficulté
    *   3. 
    */
    private async searchWord(searchedTemplate: string, result: Array<WordAndDefinition>, difficulty: string){
        await this.sendGetRequest(searchedTemplate);
        //Ici on traite les données JSON reçues de la requête:
        {
            /***************/
            fs.writeFileSync("preProcess.json", JSON.stringify(this.requestResult, null, 2)); //On veut temporairement écrire le JSON pour le visualiser à des fins de développement
            /***************/

            const LENGTH = Object.keys(this.requestResult).length;
            
            for(let i: number = 0; i < LENGTH; i++){
                if(this.requestResult[i].hasOwnProperty("defs")){
                    result.push(new WordAndDefinition(this.requestResult[i]));
                }
            }
            


            /***************/
            fs.writeFileSync("postProcess.json", JSON.stringify(this.requestResult, null, 2)); //On veut temporairement écrire le JSON pour le visualiser à des fins de développement
            /***************/
        }
    }
}