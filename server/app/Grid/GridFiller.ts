import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { IWord, Orientation } from "../../../common/interfaces/IWord";
import { EMPTY_SQUARE, BLACKSQUARE_CHARACTER, WORD_CACHE, WORD_CACHE_OFFSET, WORD_CUTOFF } from "./Constants";
import { Difficulty, LexicalService } from "../Services/LexicalService/LexicalService";
import { WordAndDefinition } from "../Services/LexicalService/Interfaces";

const lexicalService: LexicalService = new LexicalService();
export class GridFiller {
    private grid: string[][];
    private wordsPlaced: IWord[];
    private wordsToFill: IWord[];
    private sideSize: number;
    private difficulty: number;

    public constructor() {
        this.sideSize = 0;
        this.grid = new Array<Array<string>>();
        this.wordsPlaced = new Array<IWord>();
        this.wordsToFill = new Array<IWord>();

        for (const array of WORD_CACHE) {
            this.shuffle(array[Difficulty.EASY]);
            this.shuffle(array[Difficulty.MEDIUM]);
            this.shuffle(array[Difficulty.HARD]);
        }
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
            isDone = this.fillGridWithWords();
        }
        this.fillRemainingSpacesWithBlacksquares();
        await this.fetchDefinitions();

        return this.wordsPlaced;
    }

    // Fisher-Yates Algorithm
    private shuffle(words: Array<string>): void {
        let currentIndex: number = words.length;
        let temporaryValue: string;
        let randomIndex: number;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = words[currentIndex];
            words[currentIndex] = words[randomIndex];
            words[randomIndex] = temporaryValue;
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

    private async fetchDefinitions(): Promise<void> {
        const promises: Promise<void>[] = new Array<Promise<void>>();
        for (const word of this.wordsPlaced) {
            promises.push(lexicalService.searchWords(word.content, this.difficulty).then((wordAndDefs: WordAndDefinition[]) => {
                for (const wordAndDef of wordAndDefs) {
                    if (wordAndDef.word === word.content) {
                        word.definition = wordAndDef.definition;
                    }
                }
            }));
        }
        await Promise.all(promises);
    }

    // tslint:disable-next-line:max-func-body-length
    private fillGridWithWords(): boolean {
        if (this.gridFilled()) {
            return true;
        }
        const wordToPlace: IWord = this.wordsToFill.pop();
        const entries: string[] = this.getWords(wordToPlace);
        if (entries.length === 0) {
            this.wordsToFill.push(wordToPlace);

            return false;
        }

        for (const entry of entries) {
            const wordAdded: IWord = { position: wordToPlace.position, orientation: wordToPlace.orientation,
                                       content: entry, definition: "" };

            this.addNewWord(wordAdded);
            this.sortWordsToFillByCommonLetters();
            const nextWordPlaced: boolean = this.fillGridWithWords();
            if (nextWordPlaced) {
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
        for (const word of WORD_CACHE[wordToFill.content.length + WORD_CACHE_OFFSET][this.difficulty]) {
            let valid: boolean = true;
            for (let i: number = 0; i < word.length; ++i) {
                if (template[i] !== "?" && template[i] !== word[i]) {
                    valid = false;
                }
            }
            if (valid && !this.verifyAlreadyUsedWord(word) && validWords.length < WORD_CUTOFF) {
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
}
