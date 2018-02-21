import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import * as cst from "./Constants";
import { IWord, Orientation } from "../../../common/interfaces/IWord";
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
        // console.log(this.grid);
        // console.log(this.Words);

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

    // tslint:disable-next-line:max-func-body-length
    private establishWordLengths(): void {
        for (let i: number = 0; i < this.sideSize; i++) {
            let nLettersCol: number = 0, nLettersRow: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.grid[j][i] === cst.EMPTY_SQUARE) {
                    ++nLettersCol;
                } else {
                    if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordsLengths.push({ position: { x: Math.abs(Math.floor(j - nLettersCol)), y: i } as ICoordXY,
                                                 orientation: Orientation.Horizontal,
                                                 content: StringService.generateDefaultString(nLettersCol), definition: ""} as IWord);
                    }
                    nLettersCol = 0;
                }
                if (this.grid[i][j] === cst.EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordsLengths.push( { position: { x: i, y:  Math.abs(Math.floor(j - nLettersRow)) } as ICoordXY,
                                                  orientation: Orientation.Vertical,
                                                  content: StringService.generateDefaultString(nLettersRow), definition: ""} as IWord);
                    }
                    nLettersRow = 0;
                }
            }
            if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push({ position: { x: Math.abs(Math.floor(this.sideSize - nLettersCol)), y: i } as ICoordXY,
                                         orientation: Orientation.Horizontal,
                                         content: StringService.generateDefaultString(nLettersCol), definition: "" } as IWord);
            }
            if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push({ position: { x: i, y:  Math.abs(Math.floor(this.sideSize - nLettersRow)) } as ICoordXY,
                                         orientation: Orientation.Vertical,
                                         content: StringService.generateDefaultString(nLettersRow), definition: "" } as IWord);
            }
        }
    }

    private fillGridWithWords(): boolean {
        // console.log(this.grid);
        // console.log("Words: " + this.words.length + "   WordsLength: " + this.wordsLengths.length);
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
        // console.log(this.grid);
        // console.log("Words: " + this.words.length + "   WordsLength: " + this.wordsLengths.length);

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
                this.grid[newWord.position.x + i][newWord.position.y] = newWord.content.length[i];
            } else {
                this.grid[newWord.position.x][newWord.position.y + i] = newWord.content.length[i];
            }
        }
    }

    private countLettersBelongingOtherWords(word: IWord): number {
        let nCommonLetters: number = 0;
        for (let i: number = 0; i < word.content.length; i++) {
            if (word.orientation === Orientation.Horizontal) {
                if (this.letterBelongsOtherWord( { x: Math.abs(Math.floor(word.position.x + i)),
                                                   y: Math.abs(Math.floor(word.position.y))} as ICoordXY)) {
                    ++nCommonLetters;
                }
            } else {
                if (this.letterBelongsOtherWord({ x: Math.abs(Math.floor(word.position.x)),
                                                  y: Math.abs(Math.floor(word.position.y + i))} as ICoordXY)) {
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
            if (leftWord.position.x <= rightWord.position.x && leftWord.position.x + leftWord.content.length >= rightWord.position.x) {
                return true;
            }
        } else {
            if (leftWord.position.y <= rightWord.position.y && leftWord.position.y + leftWord.content.length >= rightWord.position.y) {
                return true;
            }
        }

        return false;
    }

    private letterBelongsOtherWord(position: ICoordXY): boolean {
        let belongs: boolean = false;
        this.words.forEach((word: IWord) => {
            if (word.orientation === Orientation.Horizontal) {
                if (word.position.y === position.y) {
                    if (word.position.x <= position.x && word.position.x + word.content.length - 1 >= position.x) {
                        belongs = true;
                    }
                }
            } else {
                if (word.position.x === position.x) {
                    if (word.position.y <= position.y && word.position.y + word.content.length - 1 >= position.y) {
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
                this.grid[nextWord.position.x][i + nextWord.position.y] :
                this.grid[nextWord.position.x + i][nextWord.position.y];
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
                if (!this.letterBelongsOtherWord({ x: Math.abs(Math.floor(lastWord.position.x + i)),
                                                   y: Math.abs(Math.floor(lastWord.position.y))} as ICoordXY)) {
                    this.grid[lastWord.position.x + i][lastWord.position.y] = cst.EMPTY_SQUARE;
                }
            } else {
                if (!this.letterBelongsOtherWord({ x: Math.abs(Math.floor(lastWord.position.x)),
                                                   y: Math.abs(Math.floor(lastWord.position.y + i))} as ICoordXY)) {
                    this.grid[lastWord.position.x][lastWord.position.y + i] = cst.EMPTY_SQUARE;
                }
            }
        }
    }
// tslint:disable-next-line:max-file-line-count
}
