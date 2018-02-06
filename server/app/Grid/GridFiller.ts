import { CoordXY } from "./CoordXY";
import * as cst from "./Constants";
import { Word, Orientation } from "./Word";
import { DictionaryEntry, Constraint } from "./Interfaces";
import { StringService } from "./StringService";

export class GridFiller {

    private static instance: GridFiller;
    private grid: string[][];
    private words: Word[];
    private wordsLengths: Word[];
    private difficultyLevel: number;
    private sideSize: number;

    private constructor() {
        this.difficultyLevel = 0;
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

    public fillWords(grid: string[][], difficultyLevel: number, sideSize: number): string[][] {
        this.difficultyLevel = difficultyLevel;
        this.sideSize = sideSize;
        this.grid = grid;

        this.establishWordLengths();
        this.sortWordLengths();

        while (!this.fillGridWithWords()) {
            // Do nothing
        }

        this.fillRemainingSpacesWithBlacksquares();

        return this.grid;
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

    private fillGridWithWords(): boolean {
        if (this.wordsLengths.length === 0) {
            return true;
        }
        if (this.words.length >= (this.words.length + this.wordsLengths.length) * cst.HALF) {
            return true;
        }
        const longestFreeSpace: Word = this.wordsLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.Length,
                                                                     this.establishConstraints(longestFreeSpace));
        if (entry.word === cst.NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);

            return false;
        }
        this.addNewWord(new Word(longestFreeSpace.Position, longestFreeSpace.Orientation, entry.word, entry.definition));
        this.sortWordLengthsByCommonLetters();

        if (!this.fillGridWithWords()) {
            this.backtrack();
            this.wordsLengths.push(longestFreeSpace);
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
        if (this.wordsLengths.length === 0) {
            return true;
        }
        const longestFreeSpace: Word = this.wordsLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.Length,
                                                                     this.establishConstraints(longestFreeSpace));
        if (entry.word === cst.NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);

            return false;
        }
        this.addNewWord(new Word(longestFreeSpace.Position, longestFreeSpace.Orientation, entry.word, entry.definition));
        this.sortWordLengthsByCommonLetters();

        if (!this.fillGridWithWords()) {
            this.backtrack();
            this.wordsLengths.push(longestFreeSpace);

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

    // Temporary, to be replaced when we have a lexical service
    private searchWordsTemporaryDB(length: number, requiredLettersPositions: Constraint[]): DictionaryEntry {
        const searchResults: DictionaryEntry[] = cst.DICTIONNARY.filter((entry: DictionaryEntry) => {
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
            if (entry.word[constraint.position] === undefined) {
                passesFilter = false;
            } else if (entry.word[constraint.position].toUpperCase() !== constraint.letter.toUpperCase()) {
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
