import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { IWord, Orientation } from "../../../common/interfaces/IWord";
import { StringService } from "./StringService";
import { WordAndDefinition } from "../Services/LexicalService/Interfaces";
import { EMPTY_SQUARE, NOT_FOUND, BLACKSQUARE_CHARACTER, MAX_WORD_QUERY_ATTEMPS, WORD_CACHE } from "./Constants";
import { Difficulty, LexicalService } from "../Services/LexicalService/LexicalService";

const lexicalService: LexicalService = new LexicalService();
export class GridFiller {

    private grid: string[][];
    private wordsPlaced: IWord[];
    private wordsToFill: IWord[];
    private sideSize: number;
    private difficulty: number;
    private problemWord: IWord;

    public constructor() {
        this.sideSize = 0;
        this.grid = new Array<Array<string>>();
        this.wordsPlaced = new Array<IWord>();
        this.wordsToFill = new Array<IWord>();

        for (const array of WORD_CACHE) {
            this.shuffleCars(array);
        }
    }

    public get Words(): IWord[] {
        return this.wordsPlaced;
    }

    public get Content(): string[][] {
        return this.grid;
    }

    public fillWords(grid: string[][], sideSize: number, difficulty: Difficulty, wordsToFill: IWord[]): IWord[] {
        this.sideSize = sideSize;
        this.grid = grid;
        this.difficulty = difficulty;
        this.wordsToFill = wordsToFill;
        this.sortWordsToFillByLength();

        let isDone: boolean = false;
        while (!isDone) {
            isDone = this.fillGridWithWords();
        }
        this.fillRemainingSpacesWithBlacksquares();
        console.log(this.grid);
        return this.wordsPlaced;
    }

    // Fisher-Yates Algorithm
    private shuffleCars(cars: Array<string>): void {
        let currentIndex: number = cars.length;
        let temporaryValue: string;
        let randomIndex: number;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cars[currentIndex];
            cars[currentIndex] = cars[randomIndex];
            cars[randomIndex] = temporaryValue;
        }
    }

    private sortWordsToFillByLength(): void {
        this.wordsToFill.sort((left: IWord, right: IWord): number => {
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

    private sortWordsToFillByCommonLetters(): void {
        this.wordsToFill.sort((left: IWord, right: IWord): number => {
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
    private fillGridWithWords(): boolean {
        if (this.gridFilled()) {
            console.log("filled");
            return true;
        }
        console.log(this.grid);
        console.log(this.wordsPlaced.length + " -- " + this.wordsToFill.length);
        const wordToPlace: IWord = this.wordsToFill.pop();
        const entries: string[] = this.getWords(wordToPlace);
        if (entries.length === 0) {
            this.wordsToFill.push(wordToPlace);
            this.problemWord = wordToPlace;

            return false;
        }

        for (const entry of entries) {
            const wordAdded: IWord = { position: wordToPlace.position, orientation: wordToPlace.orientation,
                                       content: entry, definition: "" };

            this.addNewWord(wordAdded);
            this.sortWordsToFillByCommonLetters();
            const nextWordPlaced: boolean = this.fillGridWithWords();
            if (nextWordPlaced) {
                console.log("FILLED");
                return true;
            }
            this.backtrack(wordAdded);
        }
        this.wordsToFill.push(wordToPlace);

        return false;
    }

    private gridFilled(): boolean {
        return (this.wordsToFill.length === 0);
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
        this.wordsPlaced.push(newWord);
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
                if (this.letterBelongsOtherWord( { x: word.position.x + i,
                                                   y: word.position.y } as ICoordXY)) {
                    ++nCommonLetters;
                }
            } else {
                if (this.letterBelongsOtherWord({ x: word.position.x,
                                                  y: word.position.y + i } as ICoordXY)) {
                    ++nCommonLetters;
                }
            }
        }

        if (this.wordsPlaced.filter((wordPlaced: IWord) => wordPlaced === word).length !== 0) {
            nCommonLetters -= word.content.length;
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
        this.wordsPlaced.forEach((word: IWord) => {
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

    private getWords(wordToFill: IWord): string[] {
        const template: string = this.getSearchTemplate(wordToFill);
        const validWords: string[] = new Array<string>();
        for (const word of WORD_CACHE[wordToFill.content.length - 3]) {
            let valid: boolean = true;
            for (let i: number = 0; i < word.length; ++i) {
                if (template[i] !== "?" && template[i] !== word[i]) {
                    valid = false;
                }
            }
            if (valid) {
                validWords.push(word);
            }
        }

        return validWords;
    }

    private verifyAlreadyUsedWord(wordToCheck: string): boolean {
        return this.wordsPlaced.filter((word: IWord) => word.content === wordToCheck).length > 0;
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
        const wordsPlaced: WordAndDefinition[] = await lexicalService.searchWords(searchTemplate, this.difficulty);

        if (wordsPlaced.length === 0) {
            return { word: NOT_FOUND, definition: "" };
        }
        const randomInt: number = Math.floor(Math.random() * wordsPlaced.length);

        return {
            word: StringService.cleanWord(wordsPlaced[randomInt].word).toUpperCase(),
            definition: wordsPlaced[randomInt].definition
        };

    }

    private findWordWithCommonLetters(wordCompared: IWord): IWord {
        const wordsFound: IWord[] = new Array<IWord>();
        this.wordsPlaced.forEach((word: IWord) => {
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

        this.wordsPlaced = this.wordsPlaced.filter((word: IWord) => !(word.orientation === wordToErase.orientation &&
                                                                    word.position === wordToErase.position));

        this.removeLastWordFromGrid(wordToErase);
    }

    private removeLastWordFromGrid(lastWord: IWord): void {
        for (let i: number = 0; i < lastWord.content.length; i++) {
            if (lastWord.orientation === Orientation.Horizontal) {
                if (!this.letterBelongsOtherWord({ x: lastWord.position.x + i,
                                                   y: lastWord.position.y } as ICoordXY)) {
                    this.grid[lastWord.position.x + i][lastWord.position.y] = EMPTY_SQUARE;
                }
            } else {
                if (!this.letterBelongsOtherWord({ x: lastWord.position.x,
                                                   y: lastWord.position.y + i } as ICoordXY)) {
                    this.grid[lastWord.position.x][lastWord.position.y + i] = EMPTY_SQUARE;
                }
            }
        }
    }
// tslint:disable-next-line:max-file-line-count
}
