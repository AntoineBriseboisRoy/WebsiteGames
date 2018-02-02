export class WordAndDefinition {

    private word: string;
    private definition: string;

    constructor(jsonElement: any) {
        this.word = jsonElement.word;
        this.definition = jsonElement.defs;
    }

    public getWord(): string {
        return this.word;
    }

    public getDefinition() : string {
       return this. definition; 
    }
}
