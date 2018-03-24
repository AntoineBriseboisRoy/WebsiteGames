import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { IWord, Orientation } from "../../../common/interfaces/IWord";
import { StringService } from "./StringService";
import { WordAndDefinition } from "../Services/LexicalService/Interfaces";
import { EMPTY_SQUARE, MIN_LETTERS_FOR_WORD, NOT_FOUND, BLACKSQUARE_CHARACTER, MAX_WORD_QUERY_ATTEMPS } from "./Constants";
import { Difficulty, LexicalService } from "../Services/LexicalService/LexicalService";

export class GridFiller {

    private grid: string[][];
    private words: IWord[];
    private wordsLengths: IWord[];
    private sideSize: number;
    private difficulty: number;
    private problemWord: IWord;

    public constructor(private lexicalService: LexicalService) {
        this.sideSize = 0;
        this.grid = new Array<Array<string>>();
        this.words = new Array<IWord>();
        this.wordsLengths = new Array<IWord>();
    }

    public get Words(): IWord[] {
        return this.words;
    }

    public async fillWords(grid: string[][], sideSize: number, difficulty: Difficulty): Promise<IWord[]> {
        this.sideSize = sideSize;
        this.grid = grid;
        this.difficulty = difficulty;

        this.establishWordLengths();
        this.sortWordLengths();
        let isDone: boolean = false;
        while (!isDone) {
            isDone = await this.fillGridWithWords();
        }
        this.fillRemainingSpacesWithBlacksquares();
        console.log(this.grid);
        console.log("done");

        return this.words;
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
                if (this.grid[j][i] === EMPTY_SQUARE) {
                    ++nLettersCol;
                } else {
                    if (nLettersCol >= MIN_LETTERS_FOR_WORD) {
                        this.wordsLengths.push({ position: { x: Math.abs(Math.floor(j - nLettersCol)), y: i } as ICoordXY,
                                                 orientation: Orientation.Horizontal,
                                                 content: StringService.generateDefaultString(nLettersCol), definition: ""} as IWord);
                    }
                    nLettersCol = 0;
                }
                if (this.grid[i][j] === EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= MIN_LETTERS_FOR_WORD) {
                        this.wordsLengths.push( { position: { x: i, y:  Math.abs(Math.floor(j - nLettersRow)) } as ICoordXY,
                                                  orientation: Orientation.Vertical,
                                                  content: StringService.generateDefaultString(nLettersRow), definition: ""} as IWord);
                    }
                    nLettersRow = 0;
                }
            }
            if (nLettersCol >= MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push({ position: { x: Math.abs(Math.floor(this.sideSize - nLettersCol)), y: i } as ICoordXY,
                                         orientation: Orientation.Horizontal,
                                         content: StringService.generateDefaultString(nLettersCol), definition: "" } as IWord);
            }
            if (nLettersRow >= MIN_LETTERS_FOR_WORD) {
                this.wordsLengths.push({ position: { x: i, y:  Math.abs(Math.floor(this.sideSize - nLettersRow)) } as ICoordXY,
                                         orientation: Orientation.Vertical,
                                         content: StringService.generateDefaultString(nLettersRow), definition: "" } as IWord);
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private async fillGridWithWords(): Promise<boolean> {
        console.log("fillGridWithWords");
        if (this.gridFilled()) {
            return true;
        }
        console.log(this.words.length, "  --  ", this.wordsLengths.length);
        console.log(this.grid);

        this.sortWordLengthsByCommonLetters();
        const longestFreeSpace: IWord = this.wordsLengths.pop();
        const entry: WordAndDefinition = await this.getWord(longestFreeSpace);
        if (entry.word === NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);
            this.problemWord = longestFreeSpace;

            return false;
        }
        const wordAdded: IWord = { position: longestFreeSpace.position, orientation: longestFreeSpace.orientation,
                                   content: entry.word, definition: entry.definition };
        this.addNewWord(wordAdded);
        this.sortWordLengthsByCommonLetters();

        let nextWordPlaced: boolean = await this.fillGridWithWords();
        if (!nextWordPlaced) {
            this.backtrack(this.findWordWithCommonLetters(this.problemWord));
            nextWordPlaced = await  this.fillGridWithWordsNextTry();

            return nextWordPlaced;
        } else {

            return true;
        }
    }

    private gridFilled(): boolean {
        return (this.wordsLengths.length === 0);
    }

    // tslint:disable-next-line:max-func-body-length
    private async fillGridWithWordsNextTry(): Promise<boolean> {
        console.log("fillGridWithWordsNextTry");
        if (this.gridFilled()) {
            console.log("filled");

            return true;
        }
        console.log(this.words.length, "  --  ", this.wordsLengths.length);
        console.log(this.grid);

        this.sortWordLengthsByCommonLetters();
        const longestFreeSpace: IWord = this.wordsLengths.pop();
        const entry: WordAndDefinition = await this.getWord(longestFreeSpace);
        if (entry.word === NOT_FOUND) {
            this.wordsLengths.push(longestFreeSpace);
            this.problemWord = longestFreeSpace;

            return false;
        }
        const wordAdded: IWord = {position: longestFreeSpace.position, orientation: longestFreeSpace.orientation,
                                  content: entry.word, definition: entry.definition };
        this.addNewWord(wordAdded);
        this.sortWordLengthsByCommonLetters();

        const nextWordPlaced: boolean = await this.fillGridWithWords();
        if (!nextWordPlaced) {
            this.backtrack(this.findWordWithCommonLetters(this.problemWord));

            return false;
        } else {

            return true;
        }
    }

    private fillRemainingSpacesWithBlacksquares(): void {
        for (let i: number = 0; i < this.sideSize; ++i) {
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === EMPTY_SQUARE) {
                    this.grid[i][j] = BLACKSQUARE_CHARACTER;
                }
            }
        }
    }

    private addNewWord (newWord: IWord): void {
        this.words.push(newWord);
        for (let i: number = 0; i < newWord.content.length; i++) {
            if (newWord.orientation === Orientation.Horizontal) {
                this.grid[newWord.position.x + i][newWord.position.y] = newWord.content[i];
            } else {
                this.grid[newWord.position.x][newWord.position.y + i] = newWord.content[i];
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

    private async getWord(wordToFill: IWord): Promise<WordAndDefinition>  {
        let nAttempts: number = 0;
        let wordFound: WordAndDefinition;
        do {
            wordFound = await this.queryWordFromDB(this.getSearchTemplate(wordToFill));
            if (wordFound.word === NOT_FOUND) {
                return wordFound;
            }
            ++nAttempts;
        } while (this.verifyAlreadyUsedWord(wordFound.word) && nAttempts < MAX_WORD_QUERY_ATTEMPS);

        return wordFound;
    }

    private verifyAlreadyUsedWord(wordToCheck: string): boolean {
        return this.words.filter((word: IWord) => word.content === wordToCheck).length > 0;
    }

    private getSearchTemplate(nextWord: IWord): string {
        let searchTemplate: string = "";
        for (let i: number = 0; i < nextWord.content.length; i++) {
            const currentChar: string = (nextWord.orientation === Orientation.Vertical) ?
                this.grid[nextWord.position.x][i + nextWord.position.y] :
                this.grid[nextWord.position.x + i][nextWord.position.y];
            if (currentChar === EMPTY_SQUARE) {
                searchTemplate += "?";
            } else {
                searchTemplate += currentChar;
            }
        }

        return searchTemplate;
    }

    private async queryWordFromDB(searchTemplate: string): Promise<WordAndDefinition> {
        const words: WordAndDefinition[] = await this.lexicalService.searchWords(searchTemplate, this.difficulty);

        if (words.length === 0) {
            return { word: NOT_FOUND, definition: "" };
        }
        const randomInt: number = Math.floor(Math.random() * words.length);

        return {
            word: StringService.cleanWord(words[randomInt].word).toUpperCase(),
            definition: words[randomInt].definition
        };

    }

    private findWordWithCommonLetters(wordCompared: IWord): IWord {
        let wordsFound: IWord[] = new Array<IWord>();
        this.words.forEach((word: IWord) => {
            if (this.haveCommonLetter(word, wordCompared)) {
                wordsFound.push(word);
            }
        });
        let lowestCountWord: IWord = wordsFound[0];
        wordsFound.forEach((word: IWord) => {
            if (this.countLettersBelongingOtherWords(lowestCountWord) > this.countLettersBelongingOtherWords(word)) {
                lowestCountWord = word;
            }
        });

        return lowestCountWord;
    }

    private backtrack(wordToErase: IWord): void {
        if (wordToErase === undefined) {
            return;
        }
        this.words = this.words.filter((word: IWord) => word !== wordToErase);
        this.wordsLengths.push(wordToErase);
        this.removeLastWordFromGrid(wordToErase);
    }

    private removeLastWordFromGrid(lastWord: IWord): void {
        for (let i: number = 0; i < lastWord.content.length; i++) {
            if (lastWord.orientation === Orientation.Horizontal) {
                if (!this.letterBelongsOtherWord({ x: Math.abs(Math.floor(lastWord.position.x + i)),
                                                   y: Math.abs(Math.floor(lastWord.position.y))} as ICoordXY)) {
                    this.grid[lastWord.position.x + i][lastWord.position.y] = EMPTY_SQUARE;
                }
            } else {
                if (!this.letterBelongsOtherWord({ x: Math.abs(Math.floor(lastWord.position.x)),
                                                   y: Math.abs(Math.floor(lastWord.position.y + i))} as ICoordXY)) {
                    this.grid[lastWord.position.x][lastWord.position.y + i] = EMPTY_SQUARE;
                }
            }
        }
    }
// tslint:disable-next-line:max-file-line-count
}
