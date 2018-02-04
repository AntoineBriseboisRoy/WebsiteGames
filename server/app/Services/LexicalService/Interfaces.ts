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
    json: boolean;  // automatically parse data to JSON format
    simple: boolean; // should request promise for status code other than 2xx
}
