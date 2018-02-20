import { CoordXY } from "./CoordXY";
import * as cst from "./Constants";
import { Word, Orientation } from "../../../common/Word";
import { DictionaryEntry, Constraint } from "./Interfaces";
import { StringService } from "./StringService";

export class GridFiller {

    private static instance: GridFiller;
    private grid: string[][];
    private words: Word[];
    private wordsLengths: Word[];
    private sideSize: number;

    private constructor() {
        this.sideSize = 0;
        this.grid = new Array<Array<string>>();
        this.words = new Array<Word>();
        this.wordsLengths = new Array<Word>();
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

    public fillWords(grid: string[][], sideSize: number): string[][] {
        this.sideSize = sideSize;
        this.grid = grid;

        this.establishWordLengths();
        this.sortWordLengths();
        while (!this.fillGridWithWords()) { /* Do nothing */ }
        this.fillRemainingSpacesWithBlacksquares();
        console.log(this.grid);
        console.log(this.Words);

        return this.grid;
    }

    private sortWordLengths(): void {
        this.wordsLengths.sort((left: Word, right: Word): number => {
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
        this.wordsLengths.sort((left: Word, right: Word): number => {
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

    private establishWordLengths(): void {
        for (let i: number = 0; i < this.sideSize; i++) {
            let nLettersCol: number = 0, nLettersRow: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.grid[j][i] === cst.EMPTY_SQUARE) {
                    ++nLettersCol;
                } else {
                    if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordsLengths.push(new Word(new CoordXY(j - nLettersCol, i),
                                                        Orientation.Horizontal, StringService.generateDefaultString(nLettersCol), ""));
                    }
                    nLettersCol = 0;
                }
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordsLengths.push(new Word(new CoordXY(i, j - nLettersRow),
                                                        Orientation.Vertical, StringService.generateDefaultString(nLettersRow), ""));
                    }
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

    private fillGridWithWords(): boolean {
        console.log(this.grid);
        console.log("Words: " + this.words.length + "   WordsLength: " + this.wordsLengths.length);
        if (this.gridFilled()) {
            return true;
        }
        const longestFreeSpace: Word = this.wordsLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.Length,
                                                                     this.establishConstraints(longestFreeSpace));
        if (entry.word === cst.NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);

            return false;
        }
        const wordAdded: Word = new Word(longestFreeSpace.Position, longestFreeSpace.Orientation, entry.word, entry.definition);
        this.addNewWord(wordAdded);
        this.sortWordLengthsByCommonLetters();

        if (!this.fillGridWithWords()) {
            this.backtrack(this.findWordWithCommonLetters(wordAdded));

            return (this.fillGridWithWordsNextTry());
        } else {
            return true;
        }
    }

    private gridFilled(): boolean {
        return (this.wordsLengths.length === 0);
    }

    private fillGridWithWordsNextTry(): boolean {
        if (this.gridFilled()) {
            return true;
        }
        console.log(this.grid);
        console.log("Words: " + this.words.length + "   WordsLength: " + this.wordsLengths.length);

        const longestFreeSpace: Word = this.wordsLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.Length,
                                                                     this.establishConstraints(longestFreeSpace));
        if (entry.word === cst.NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);

            return false;
        }
        const wordAdded: Word = new Word(longestFreeSpace.Position, longestFreeSpace.Orientation, entry.word, entry.definition);
        this.addNewWord(wordAdded);
        this.sortWordLengthsByCommonLetters();

        if (!this.fillGridWithWords()) {
            this.backtrack(this.findWordWithCommonLetters(wordAdded));

            return false;
        } else {
            return true;
        }
    }

    private fillRemainingSpacesWithBlacksquares(): void {
        for (let i: number = 0; i < this.sideSize; ++i) {
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    this.grid[i][j] = cst.BLACKSQUARE_CHARACTER;
                }
            }
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

    private haveCommonLetter(leftWord: Word, rightWord: Word): boolean {
        if (leftWord.Orientation === rightWord.Orientation) {
            return false;
        }
        if (leftWord.Orientation === Orientation.Horizontal) {
            if (leftWord.Position.X <= rightWord.Position.X && leftWord.Position.X + leftWord.Length >= rightWord.Position.X) {
                return true;
            }
        } else {
            if (leftWord.Position.Y <= rightWord.Position.Y && leftWord.Position.Y + leftWord.Length >= rightWord.Position.Y) {
                return true;
            }
        }

        return false;
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

    private establishConstraints(nextWord: Word): Constraint[] {
        const constraints: Constraint[] = new Array<Constraint>();
        for (let i: number = 0; i < nextWord.Length; i++) {
            const currentChar: string = (nextWord.Orientation === Orientation.Vertical) ?
                this.grid[nextWord.Position.X][i + nextWord.Position.Y] :
                this.grid[nextWord.Position.X + i][nextWord.Position.Y];
            if (currentChar !== cst.EMPTY_SQUARE) {
                constraints.push({position: i, letter: currentChar});
            }
        }

        return constraints;
    }

    private findWordsWithConstraints(length: number, constraints: Constraint[]): DictionaryEntry {
        let nAttempts: number = 0;
        let word: DictionaryEntry;

        do {
            word = this.searchWordsTemporaryDB(length, constraints);
            if (word.word === cst.NOT_FOUND) {
                return { word: cst.NOT_FOUND, definition: "", field3: "" };
            }
            ++nAttempts;
        } while (this.verifyAlreadyUsedWord(word.word) && nAttempts < cst.MAX_WORD_QUERY_ATTEMPS);

        return word;
    }

    private verifyAlreadyUsedWord(wordToCheck: string): boolean {
        return this.words.filter((word: Word) => word.Content === wordToCheck).length > 0;
    }

    // Temporary, to be replaced when we can establish a proper link with the lexical service
    private searchWordsTemporaryDB(length: number, requiredLettersPositions: Constraint[]): DictionaryEntry {
        const searchResults: DictionaryEntry[] = cst.DICTIONNARY.filter((entry: DictionaryEntry) => {
            return this.constraintFilter(entry, length, requiredLettersPositions); }
        );
        const randomInt: number =  Math.floor(Math.random() * searchResults.length);

        return searchResults.length === 0 ? { word: cst.NOT_FOUND, definition: "", field3: "" } :
            {word: StringService.eliminateSpecialChars(StringService.replaceAccentedChars(searchResults[randomInt].word)).toUpperCase(),
             definition: searchResults[randomInt].definition, field3: ""};
    }

    private constraintFilter(entry: DictionaryEntry, length: number, requiredLettersPositions: Constraint[]): boolean {
        let passesFilter: boolean = true;
        const cleanWord: string = StringService.eliminateSpecialChars(StringService.replaceAccentedChars(entry.word));
        if (cleanWord.length !== length) {
            passesFilter = false;
        }
        requiredLettersPositions.forEach((constraint: Constraint) => {
            if (cleanWord[constraint.position] === undefined) {
                passesFilter = false;
            } else if (cleanWord[constraint.position].toUpperCase() !== constraint.letter.toUpperCase()) {
                passesFilter = false;
            }
        });

        return passesFilter;
    }

    private findWordWithCommonLetters(wordCompared: Word): Word {
        let wordFound: Word = this.words[0];
        this.words.forEach((word: Word) => {
            if (this.haveCommonLetter(word, wordCompared)) {
                wordFound = word;
            }
        });

        return wordFound;
    }

    private backtrack(wordToErase: Word): void {
        this.words = this.words.filter((word: Word) => word !== wordToErase);
        this.wordsLengths.push(wordToErase);
        this.removeLastWordFromGrid(wordToErase);
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
}
