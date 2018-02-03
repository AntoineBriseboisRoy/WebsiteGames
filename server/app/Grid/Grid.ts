import { BlackSquare } from "./BlackSquare";
import { PosXY } from "./PosXY";
import { Word, Orientation } from "./Word";
import { DictionaryEntry, Constraint } from "./Interfaces";
import * as cst from "./Constants";
import { BlackSquareGenerator } from "./BlackSquareGenerator";

export class Grid {

    private gridContent: string[][];
    private words: Word[];
    private wordLengths: Word[];

    constructor(private sideSize: number, private percentageOfBlackSquares: number, private difficultyLevel: number) {
        // do {
            this.gridContent = BlackSquareGenerator.getInstance(sideSize, percentageOfBlackSquares).Generate();
        // } while (!this.verifyBlackSquareGrid());
            this.startFillingGrid();
    }

    public get GridContent(): string[][] {
        return this.gridContent;
    }

    public get Words(): Word[] {
        return this.words;
    }

    public get SideSize(): number {
        return this.sideSize;
    }

    private startFillingGrid(): void {
        this.words = new Array<Word>();
        this.wordLengths = new Array<Word>();
        this.establishWordLengths();
        this.sortWordLengths();

        while (!this.fillGridWithWords()) {
            // Do nothing
        }
    }

    private fillGridWithWords(): boolean {
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

        if (!this.fillGridWithWords()) {
            this.wordLengths.push(longestFreeSpace);
            if (!this.fillGridWithWords()) {
                this.wordLengths.push(longestFreeSpace);
                this.backtrack();

                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    private addNewWord (newWord: Word): void {
        this.words.push(newWord);

        for (let i: number = 0; i < newWord.Length; i++) {
            if (newWord.Orientation === Orientation.Vertical) {
                this.gridContent[newWord.Position.X + i][newWord.Position.Y] = newWord.Content[i];
            } else {
                this.gridContent[newWord.Position.X][newWord.Position.Y + i] = newWord.Content[i];
            }
        }
    }

    private establishWordLengths(): void {
        for (let i: number = 0; i < this.sideSize; i++) {
            let nLettersCol: number = 0, nLettersRow: number = 0, lastBlacksquarePosRow: number = 0, lastBlacksquarePosCol: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.gridContent[i][j] === cst.EMPTY_SQUARE) {
                    ++nLettersCol;
                } else {
                    if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordLengths.push(new Word(new PosXY(i, j), Orientation.Vertical, this.generateString(nLettersCol), ""));
                        lastBlacksquarePosCol = j;
                        nLettersCol = 0;
                    }
                }
                if (this.gridContent[j][i] === cst.EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                        this.wordLengths.push(new Word(new PosXY(j, i), Orientation.Vertical, this.generateString(nLettersRow), ""));
                        lastBlacksquarePosRow = i;
                        nLettersRow = 0;
                    }
                }
            }
            if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordLengths.push(new Word(new PosXY(i, lastBlacksquarePosCol), Orientation.Vertical, this.generateString(nLettersCol), ""));
            }
            if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordLengths.push(new Word(new PosXY(lastBlacksquarePosRow, i), Orientation.Vertical, this.generateString(nLettersRow), ""));
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

    private establishConstraints(nextWord: Word): Array<Constraint> {
        const constraints: Constraint[] = new Array<Constraint>();
        for (let i: number = 0; i < nextWord.Length; i++) {
            const currentChar: string = (nextWord.Orientation === Orientation.Horizontal) ?
                this.gridContent[nextWord.Position.X][i + nextWord.Position.Y] :
                this.gridContent[nextWord.Position.X + i][nextWord.Position.Y];
            if (currentChar !== cst.EMPTY_SQUARE) {
                constraints.push({position: i, letter: currentChar});
            }
        }

        return constraints;
    }

    private findWordsWithConstraints(length: number, requiredLettersPositions: Constraint[]): DictionaryEntry {
        let word: DictionaryEntry;
        do {
            word = this.searchWordsTemporaryDB(length, requiredLettersPositions, this.difficultyLevel);
            if (word === null) {
                return { word: cst.NOT_FOUND, definition: "" };
            }
        } while (this.verifyAlreadyUsedWord(word.word));

        return word;
    }

    private verifyAlreadyUsedWord(wordToCheck: string): boolean {
        return this.words.filter((word: Word) => word.Content === wordToCheck).length > 0;
    }

    // Temporary, to be replaced when we have a lexical service
    private searchWordsTemporaryDB(length: number, requiredLettersPositions: Constraint[],
                                   difficultyLevel: number /*dead parameter, we'll need eventually'*/): DictionaryEntry {
        const data: DictionaryEntry[] = require("../../../dbWords.json");
        const searchResults: DictionaryEntry[] = data.filter((entry: DictionaryEntry) => {
            return this.constraintFilter(entry, length, requiredLettersPositions); }
        );
        const randomInt: number =  Math.floor(Math.random() * searchResults.length);

        return searchResults.length === 0 ? { word: cst.NOT_FOUND, definition: "" } :
            {word: searchResults[randomInt].word, definition: searchResults[randomInt].definition};
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
                this.gridContent[lastWord.Position.X][i + lastWord.Position.Y] = cst.EMPTY_SQUARE;
            } else {
                this.gridContent[i + lastWord.Position.X][lastWord.Position.Y] = cst.EMPTY_SQUARE;
            }
        }
    }

    private removeLastWordFromWordArray(): Word {
        return this.words.pop();
    }
}
