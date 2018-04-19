import * as fs from "fs";

export const WORD_CACHE: string[][][] = JSON.parse(fs.readFileSync("./good_words.json").toString());
export const WORD_CACHE_OFFSET: number = -2;
export const BLACKSQUARE_CHARACTER: string = "*";
export const EMPTY_SQUARE: string = " ";
export const MIN_LETTERS_FOR_WORD: number = 2;
export const MIN_WORDS_PER_LINE: number = 1;
export const MAX_WORDS_PER_LINE: number = 3;
export const MAX_BLACKSQUARE_RATIO: number = 0.6;
export const NOT_FOUND: string = "NOT_FOUND_ERR";
export const PERCENTAGE_BLACK_SQUARES: number = 0.3;
export const MAX_WORD_QUERY_ATTEMPS: number = 5;
export const STANDARD_SIDE_SIZE: number = 10;
export const WORD_CUTOFF: number = 5;
export const MAX_TRIES_BEFORE_FAIL: number = 1500;

export const EMPTY_CHAR_FOR_QUERY: string = "?";
