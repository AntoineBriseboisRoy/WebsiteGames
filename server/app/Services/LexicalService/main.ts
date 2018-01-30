import * as requestPromise from "request-promise-native";
import * as fileStream from "fs";

export class WordAndDefinition {

    constructor(private word:string, private definition: string) {
    }

    public getWord(): string {
        return this.word;
    }

    public getDefinition() : string {
        return this. definition;
    }
}

//just like the main
export class LexicalService {
    
    private getRequest(searchedWord:string) {
        let options = {
            method: 'GET',
            uri: "https://api.datamuse.com/words",
            qs: {
                sp: searchedWord, //-> uri + "?sp=word"
                md: "df"
            },
            json: true,
            simple: true // should request promise for status code other than 2xx
        };
        return requestPromise(options)
            .then((data:any)=> {
                if(Object.keys(data).length === 0)
                    throw new Error("Il n'existe aucun mot pour cette requete"); 
            })
            .catch((error: Error) => {
                console.log(error.message);
        });
    }
}