import { CoordXY } from "./CoordXY";
import * as cst from "./Constants";
import { Word, Orientation } from "./Word";
import { DictionaryEntry, Constraint } from "./Interfaces";
import { StringService } from "./StringService";
import { DICTIONNARY } from "./Constants";

import { LexicalService, Difficulty } from "../Services/LexicalService/LexicalService";
export class GridFiller {

    private static instance: GridFiller;
    private grid: string[][];
    private words: Word[];
    private wordLengths: Word[];
    private difficultyLevel: number;
    private sideSize: number;
    private nAttempts: number = 0;

    private constructor() {
        this.difficultyLevel = 0;
        this.sideSize = 0;
        this.grid = new Array<Array<string>>();
        this.words = new Array<Word>();
        this.wordLengths = new Array<Word>();
    }

    public static get Instance(): GridFiller {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new GridFiller();
        }

        return this.instance;
    }

    public get Words(): Word[] {
        return this.words;
    }

    public async fillWords(grid: string[][], difficultyLevel: number, sideSize: number): Promise<string[][]> {
        this.difficultyLevel = difficultyLevel;
        this.sideSize = sideSize;
        this.grid = grid;

        this.establishWordLengths();
        this.sortWordLengths();

        while (await !this.fillGridWithWords()) {
            // Do nothing
        }

        for (let i: number = 0; i < this.sideSize; ++i) {
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    this.grid[i][j] = cst.BLACKSQUARE_CHARACTER;
                }
            }
        }
        console.log("GRILLE FINALE WOO");
        console.log(this.grid);
        return this.grid;
    }

    private fillGridWithWords(): boolean {
        if (this.wordLengths.length === 0) {
            return true;
        }
        console.log("Words array: " + this.words.length + "\t Wordlengths array: " + this.wordLengths.length);
        const longestFreeSpace: Word = this.wordLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.Length,
                                                                     this.establishConstraints(longestFreeSpace));
        ++this.nAttempts;

        if (entry.word === cst.NOT_FOUND) {
            this.wordLengths.push(longestFreeSpace);

            return false;
        }
        this.addNewWord(new Word(longestFreeSpace.Position, longestFreeSpace.Orientation, entry.word, entry.definition));
        this.sortWordLengthsByCommonLetters();

        if (!this.fillGridWithWords()) {
            this.backtrack();
            this.wordLengths.push(longestFreeSpace);
            if (!this.fillGridWithWordsNextTry()) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    private fillGridWithWordsNextTry(): boolean {
        if (this.wordLengths.length === 0) {
            return true;
        }
        const longestFreeSpace: Word = this.wordLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.Length,
                                                                     this.establishConstraints(longestFreeSpace));
        if (entry.word === cst.NOT_FOUND) {
            this.wordLengths.push(longestFreeSpace);

            return false;
        }
        this.addNewWord(new Word(longestFreeSpace.Position, longestFreeSpace.Orientation, entry.word, entry.definition));
        this.sortWordLengthsByCommonLetters();

        if (await !this.fillGridWithWords()) {
            console.log("Words status before backtrack(2): " + this.words.length);
            this.backtrack();
            this.wordLengths.push(longestFreeSpace);

            return false;
        } else {
            return true;
        }

    }

    private addNewWord (newWord: Word): void {
        this.words.push(newWord);
        for (let i: number = 0; i < newWord.Length; i++) {
            if (newWord.Orientation === Orientation.Horizontal) {
                this.grid[newWord.Position.X + i][newWord.Position.Y] = newWord.Content[i];
            } else {
                this.grid[newWord.Position.X][newWord.Position.Y + i] = newWord.Content[i];
            }
        }
    }

    private establishWordLengths(): void {
        for (let i: number = 0; i < this.sideSize; i++) {
            let nLettersCol: number = 0, nLettersRow: number = 0, lastBlacksquarePosRow: number = -1, lastBlacksquarePosCol: number = -1;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.grid[j][i] === cst.EMPTY_SQUARE) {
                    ++nLettersCol;
                } else {
                    if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordLengths.push(new Word(new CoordXY(j - nLettersCol, i), Orientation.Horizontal, StringService.generateDefaultString(nLettersCol), ""));
                    }
                    lastBlacksquarePosCol = j;
                    nLettersCol = 0;
                }
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordLengths.push(new Word(new CoordXY(i, j - nLettersRow), Orientation.Vertical, StringService.generateDefaultString(nLettersRow), ""));
                    }
                    lastBlacksquarePosRow = i;
                    nLettersRow = 0;
                }
            }
            if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push(new Word(new CoordXY(this.sideSize - nLettersCol, i), Orientation.Horizontal, StringService.generateDefaultString(nLettersCol), ""));
            }
            if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push(new Word(new CoordXY(i, this.sideSize - nLettersRow), Orientation.Vertical, StringService.generateDefaultString(nLettersRow), ""));
            }
        }
    }

    private sortWordLengths(): void {
        this.wordLengths.sort((left: Word, right: Word): number => {
            if (left.Length < right.Length) {
                return -1;
            }
            if (left.Length > right.Length) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    private sortWordLengthsByCommonLetters(): void {
        this.wordLengths.sort((left: Word, right: Word): number => {
            const nCommonLettersLeft: number = this.countLettersBelongingOtherWords(left);
            const nCommonLettersRight: number = this.countLettersBelongingOtherWords(right);

            if (nCommonLettersLeft < nCommonLettersRight) {
                return -1;
            }
            if (nCommonLettersLeft > nCommonLettersRight) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    private countLettersBelongingOtherWords(word: Word): number {
        let nCommonLetters: number = 0;
        for (let i: number = 0; i < word.Content.length; i++) {
            if (word.Orientation === Orientation.Horizontal) {
                if (this.letterBelongsOtherWord(new CoordXY(word.Position.X + i, word.Position.Y))) {
                    ++nCommonLetters;
                }
            } else {
                if (this.letterBelongsOtherWord(new CoordXY(word.Position.X, word.Position.Y + i))) {
                    ++nCommonLetters;
                }
            }
        }

        return nCommonLetters;
    }

    private establishConstraints(nextWord: Word): string {
        let constraints: string = "";

        for (let i: number = 0; i < nextWord.Length; i++) {
            const currentChar: string = (nextWord.Orientation === Orientation.Vertical) ?
                this.grid[nextWord.Position.X][i + nextWord.Position.Y] :
                this.grid[nextWord.Position.X + i][nextWord.Position.Y];
            if (currentChar !== cst.EMPTY_SQUARE) {
                constraints += currentChar;
            } else {
                constraints += cst.EMPTY_CHAR_FOR_QUERY;
            }
        }

        return constraints;
    }

    private findWordsWithConstraints(length: number, requiredLettersPositions: Constraint[]): DictionaryEntry {
        let word: DictionaryEntry;
        let iAttempts: number = 0;
        do {
            if(words.length === 0) {
                return { word: cst.NOT_FOUND, definition: "" };
            }
            ++iAttempts;
        } while (this.verifyAlreadyUsedWord(word.word) && iAttempts < cst.MAX_WORD_QUERY_ATTEMPS);

        return words[randomPosition];
    }

    private verifyAlreadyUsedWord(wordToCheck: string): boolean {
        return this.words.filter((word: Word) => word.Content === wordToCheck).length > 0;
    }

    // Temporary, to be replaced when we have a lexical service
    private searchWordsTemporaryDB(length: number, requiredLettersPositions: Constraint[]): DictionaryEntry {
        const data: DictionaryEntry[] = require("../../../dbWords.json");
        const searchResults: DictionaryEntry[] = data.filter((entry: DictionaryEntry) => {
            return this.constraintFilter(entry, length, requiredLettersPositions); }
        );
        const randomInt: number =  Math.floor(Math.random() * searchResults.length);

        return searchResults.length === 0 ? { word: cst.NOT_FOUND, definition: "", field3: "" } :
            {word: searchResults[randomInt].word, definition: searchResults[randomInt].definition, field3: ""};
    }

    private constraintFilter(entry: DictionaryEntry, length: number, requiredLettersPositions: Constraint[]): boolean {
        let passesFilter: boolean = true;
        if (entry.word.length !== length) {
            passesFilter = false;
        }
        requiredLettersPositions.forEach((constraint: Constraint) => {
            if (entry.word[constraint.position] !== constraint.letter) {
                passesFilter = false;
            }
        });

        return passesFilter;
    }

    private backtrack(): void {
        const lastWord: Word = this.removeLastWordFromWordArray();
        this.removeLastWordFromGrid(lastWord);
    }

    private removeLastWordFromGrid(lastWord: Word): void {
        for (let i: number = 0; i < lastWord.Length; i++) {
            if (lastWord.Orientation === Orientation.Horizontal) {
                if (!this.letterBelongsOtherWord(new CoordXY(lastWord.Position.X + i, lastWord.Position.Y))) {
                    this.grid[lastWord.Position.X + i][lastWord.Position.Y] = cst.EMPTY_SQUARE;
                }
            } else {
                if (!this.letterBelongsOtherWord(new CoordXY(lastWord.Position.X, lastWord.Position.Y + i))) {
                    this.grid[lastWord.Position.X][lastWord.Position.Y + i] = cst.EMPTY_SQUARE;
                }
            }
        }
    }

    private letterBelongsOtherWord(position: CoordXY): boolean {
        let belongs: boolean = false;
        this.words.forEach((word: Word) => {
            if (word.Orientation === Orientation.Horizontal) {
                if (word.Position.Y === position.Y) {
                    if (word.Position.X <= position.X && word.Position.X + word.Length - 1 >= position.X) {
                        belongs = true;
                    }
                }
            } else {
                if (word.Position.X === position.X) {
                    if (word.Position.Y <= position.Y && word.Position.Y + word.Length - 1 >= position.Y) {
                        belongs = true;
                    }
                }
            }
        });

        return belongs;
    }

    private removeLastWordFromWordArray(): Word {
        return this.words.pop();
    }
}
