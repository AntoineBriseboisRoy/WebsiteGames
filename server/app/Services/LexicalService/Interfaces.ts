export interface WordAndDefinition {
    word: string;
    definition: string;
 }

export interface RequestOptions {
    method: string;
    uri: string;
    qs: {
        sp: string, // -> uri + "?sp=word"
        md: string
    };
    json: boolean;
    simple: boolean;
}
