import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { IWord, Orientation } from "../../../common/interfaces/IWord";
import { StringService } from "./StringService";
import { WordAndDefinition } from "../Services/LexicalService/Interfaces";
import { EMPTY_SQUARE, NOT_FOUND, BLACKSQUARE_CHARACTER, MAX_WORD_QUERY_ATTEMPS } from "./Constants";
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
    }

    public get Words(): IWord[] {
        return this.wordsPlaced;
    }

    public get Content(): string[][] {
        return this.grid;
    }

    public async fillWords(grid: string[][], sideSize: number, difficulty: Difficulty, wordsToFill: IWord[]): Promise<IWord[]> {
        this.sideSize = sideSize;
        this.grid = grid;
        this.difficulty = difficulty;
        this.wordsToFill = wordsToFill;
        this.sortWordsToFillByLength();

        let isDone: boolean = false;
        while (!isDone) {
            isDone = await this.fillGridWithWords();
        }
        this.fillRemainingSpacesWithBlacksquares();

        return this.wordsPlaced;
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

    private async fillGridWithWords(): Promise<boolean> {
        if (this.gridFilled()) {
            return true;
        }
        this.sortWordsToFillByCommonLetters();
        const wordToPlace: IWord = this.wordsToFill.pop();
        const entry: WordAndDefinition = await this.getWord(wordToPlace);
        if (entry.word === NOT_FOUND) {
            this.wordsToFill.push(wordToPlace);
            this.problemWord = wordToPlace;

            return false;
        }
        const wordAdded: IWord = { position: wordToPlace.position, orientation: wordToPlace.orientation,
                                   content: entry.word, definition: entry.definition };
        this.addNewWord(wordAdded);
        this.sortWordsToFillByCommonLetters();

        let nextWordPlaced: boolean = await this.fillGridWithWords();
        if (!nextWordPlaced) {
            this.backtrack(this.findWordWithCommonLetters(this.problemWord));
            nextWordPlaced = await this.fillGridWithWordsNextTry();

            return nextWordPlaced;
        } else {
            return true;
        }
    }

    private gridFilled(): boolean {
        return (this.wordsToFill.length === 0);
    }

    private async fillGridWithWordsNextTry(): Promise<boolean> {
        if (this.gridFilled()) {
            return true;
        }
        this.sortWordsToFillByCommonLetters();
        const wordToPlace: IWord = this.wordsToFill.pop();
        const entry: WordAndDefinition = await this.getWord(wordToPlace);
        if (entry.word === NOT_FOUND) {
            this.wordsToFill.push(wordToPlace);
            this.problemWord = wordToPlace;

            return false;
        }
        const wordAdded: IWord = {position: wordToPlace.position, orientation: wordToPlace.orientation,
                                  content: entry.word, definition: entry.definition };
        this.addNewWord(wordAdded);
        this.sortWordsToFillByCommonLetters();

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
        this.wordsPlaced = this.wordsPlaced.filter((word: IWord) => word !== wordToErase);
        this.wordsToFill.push(wordToErase);
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
