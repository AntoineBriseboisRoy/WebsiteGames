import { CoordXY } from "./CoordXY";
import * as cst from "./Constants";
import { IWord, Orientation } from "../../../common/Word";
import { DictionaryEntry, Constraint } from "./Interfaces";
import { StringService } from "./StringService";

export class GridFiller {

    private static instance: GridFiller;
    private grid: string[][];
    private words: IWord[];
    private wordsLengths: IWord[];
    private sideSize: number;

    private constructor() {
        this.sideSize = 0;
        this.grid = new Array<Array<string>>();
        this.words = new Array<IWord>();
        this.wordsLengths = new Array<IWord>();
    }

    public static get Instance(): GridFiller {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new GridFiller();
        }

        return this.instance;
    }

    public get Words(): IWord[] {
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
        this.wordsLengths.sort((left: IWord, right: IWord): number => {
            if (left.content.length < right.content.length) {
                return -1;
            }
            if (left.content.length > right.content.length) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    private sortWordLengthsByCommonLetters(): void {
        this.wordsLengths.sort((left: IWord, right: IWord): number => {
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
                        this.wordsLengths.push( { position: new CoordXY(j - nLettersCol, i), orientation: Orientation.Horizontal,
                                                  content: StringService.generateDefaultString(nLettersCol), definition: ""} as IWord);
                    }
                    nLettersCol = 0;
                }
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordsLengths.push( { position: new CoordXY(i, j - nLettersRow), orientation: Orientation.Vertical,
                                                  content: StringService.generateDefaultString(nLettersRow), definition: ""} as IWord);
                    }
                    nLettersRow = 0;
                }
            }
            if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push({ position: new CoordXY(this.sideSize - nLettersCol, i), orientation: Orientation.Horizontal, content: StringService.generateDefaultString(nLettersCol), definition: "" } as IWord);
            }
            if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push({ position: new CoordXY(i, this.sideSize - nLettersRow), orientation: Orientation.Vertical, content: StringService.generateDefaultString(nLettersRow), definition: "" } as IWord);
            }
        }
    }

    private fillGridWithWords(): boolean {
        console.log(this.grid);
        console.log("Words: " + this.words.length + "   WordsLength: " + this.wordsLengths.length);
        if (this.gridFilled()) {
            return true;
        }
        const longestFreeSpace: IWord = this.wordsLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.content.length,
                                                                     this.establishConstraints(longestFreeSpace));
        if (entry.word === cst.NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);

            return false;
        }
        const wordAdded: IWord = { position: longestFreeSpace.position, orientation: longestFreeSpace.orientation,
                                   content: entry.word, definition: entry.definition };
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

        const longestFreeSpace: IWord = this.wordsLengths.pop();
        const entry: DictionaryEntry = this.findWordsWithConstraints(longestFreeSpace.content.length,
                                                                     this.establishConstraints(longestFreeSpace));
        if (entry.word === cst.NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);

            return false;
        }
        const wordAdded: IWord = {position: longestFreeSpace.position, orientation: longestFreeSpace.orientation,
                                  content: entry.word, definition: entry.definition };
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

    private addNewWord (newWord: IWord): void {
        this.words.push(newWord);
        for (let i: number = 0; i < newWord.content.length; i++) {
            if (newWord.orientation === Orientation.Horizontal) {
                this.grid[newWord.position.X + i][newWord.position.Y] = newWord.content.length[i];
            } else {
                this.grid[newWord.position.X][newWord.position.Y + i] = newWord.content.length[i];
            }
        }
    }

    private countLettersBelongingOtherWords(word: IWord): number {
        let nCommonLetters: number = 0;
        for (let i: number = 0; i < word.content.length; i++) {
            if (word.orientation === Orientation.Horizontal) {
                if (this.letterBelongsOtherWord(new CoordXY(word.position.X + i, word.position.Y))) {
                    ++nCommonLetters;
                }
            } else {
                if (this.letterBelongsOtherWord(new CoordXY(word.position.X, word.position.Y + i))) {
                    ++nCommonLetters;
                }
            }
        }

        return nCommonLetters;
    }

    private haveCommonLetter(leftWord: IWord, rightWord: IWord): boolean {
        if (leftWord.orientation === rightWord.orientation) {
            return false;
        }
        if (leftWord.orientation === Orientation.Horizontal) {
            if (leftWord.position.X <= rightWord.position.X && leftWord.position.X + leftWord.content.length >= rightWord.position.X) {
                return true;
            }
        } else {
            if (leftWord.position.Y <= rightWord.position.Y && leftWord.position.Y + leftWord.content.length >= rightWord.position.Y) {
                return true;
            }
        }

        return false;
    }

    private letterBelongsOtherWord(position: CoordXY): boolean {
        let belongs: boolean = false;
        this.words.forEach((word: IWord) => {
            if (word.orientation === Orientation.Horizontal) {
                if (word.position.Y === position.Y) {
                    if (word.position.X <= position.X && word.position.X + word.content.length - 1 >= position.X) {
                        belongs = true;
                    }
                }
            } else {
                if (word.position.X === position.X) {
                    if (word.position.Y <= position.Y && word.position.Y + word.content.length - 1 >= position.Y) {
                        belongs = true;
                    }
                }
            }
        });

        return belongs;
    }

    private establishConstraints(nextWord: IWord): Constraint[] {
        const constraints: Constraint[] = new Array<Constraint>();
        for (let i: number = 0; i < nextWord.content.length; i++) {
            const currentChar: string = (nextWord.orientation === Orientation.Vertical) ?
                this.grid[nextWord.position.X][i + nextWord.position.Y] :
                this.grid[nextWord.position.X + i][nextWord.position.Y];
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
        return this.words.filter((word: IWord) => word.content === wordToCheck).length > 0;
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

    private findWordWithCommonLetters(wordCompared: IWord): IWord {
        let wordFound: IWord = this.words[0];
        this.words.forEach((word: IWord) => {
            if (this.haveCommonLetter(word, wordCompared)) {
                wordFound = word;
            }
        });

        return wordFound;
    }

    private backtrack(wordToErase: IWord): void {
        this.words = this.words.filter((word: IWord) => word !== wordToErase);
        this.wordsLengths.push(wordToErase);
        this.removeLastWordFromGrid(wordToErase);
    }

    private removeLastWordFromGrid(lastWord: IWord): void {
        for (let i: number = 0; i < lastWord.content.length; i++) {
            if (lastWord.orientation === Orientation.Horizontal) {
                if (!this.letterBelongsOtherWord(new CoordXY(lastWord.position.X + i, lastWord.position.Y))) {
                    this.grid[lastWord.position.X + i][lastWord.position.Y] = cst.EMPTY_SQUARE;
                }
            } else {
                if (!this.letterBelongsOtherWord(new CoordXY(lastWord.position.X, lastWord.position.Y + i))) {
                    this.grid[lastWord.position.X][lastWord.position.Y + i] = cst.EMPTY_SQUARE;
                }
            }
        }
    }
}
