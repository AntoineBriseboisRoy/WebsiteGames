import { BlackSquare } from "./BlackSquare";
import { PosXY } from "./PosXY";
import { Word, Orientation } from "./Word";
import { DictionaryEntry, Constraint } from "./Interfaces";
import * as cst from "./Constants";
export class Grid {

    private gridContent: string[][];
    private blackSquares: BlackSquare[];
    private words: Word[];
    private wordLengths: Word[];

    constructor(private sideSize: number, private percentageOfBlackSquares: number, private difficultyLevel: number) {
        // do {
            this.initializeEmptyGrid();
            this.generateBlackSquares();
        // } while (!this.verifyBlackSquareGrid());
            this.startFillingGrid();
    }

    public get GridContent(): string[][] {
        return this.gridContent;
    }

    public get BlackSquares(): BlackSquare[] {
        return this.blackSquares;
    }

    public get Words(): Word[] {
        return this.words;
    }

    public get SideSize(): number {
        return this.sideSize;
    }

    private initializeEmptyGrid(): void {
        this.gridContent = new Array();
        for (let i: number = 0; i < this.SideSize; i++) {
            this.gridContent[i] = new Array<string>();
            for (let j: number = 0; j < this.sideSize; j++) {
                this.gridContent[i][j] = cst.EMPTY_SQUARE;
            }
        }
        // this.gridContent.fill(new Array(this.sideSize).fill(cst.EMPTY_SQUARE));

        this.blackSquares = new Array<BlackSquare>();
        this.words = new Array<Word>();
        this.wordLengths = new Array<Word>();
    }

    private generateBlackSquares(): void {
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;

        for (let i: number = 0; i < numberOfBlackSquaresPerLine; i++) {
            for (let j: number = 0; j < i; j++) {
                const tempPosition: PosXY = this.randomPositionGenerator();
                this.blackSquares.push(new BlackSquare(tempPosition));
                this.blackSquares.push(new BlackSquare(PosXY.invertCoordinates(tempPosition)));
                this.gridContent[tempPosition.X][tempPosition.Y] = cst.BLACKSQUARE_CHARACTER;
                this.gridContent[tempPosition.Y][tempPosition.X] = cst.BLACKSQUARE_CHARACTER;
            }
        }
    }

    private verifyBlackSquareGrid(): boolean {
        return this.correctBlackSquareRatio() && this.correctNumberWords();
    }

    private correctBlackSquareRatio(): boolean {

        for (let i: number = 0; i < this.sideSize; i++) {
            let nBlackSquaresRow: number = 0, nBlackSquaresCol: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.gridContent[i][j] === cst.BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresRow;
                }
                if (this.gridContent[j][i] === cst.BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresCol;
                }
            }
            if (nBlackSquaresCol / this.sideSize > cst.MAX_BLACKSQUARE_RATIO ||
                nBlackSquaresRow / this.sideSize > cst.MAX_BLACKSQUARE_RATIO) {
                return false;
            }
        }

        return true;
    }

    private correctNumberWords(): boolean {
        for (let i: number = 0; i < this.sideSize; ++i) {
            let nEmptySquaresRow: number = 0, nWordsRow: number = 0, nEmptySquaresCol: number, nWordsCol: number = 0;
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.gridContent[i][j] === cst.EMPTY_SQUARE) {
                    ++nEmptySquaresRow;
                } else if (this.gridContent[i][j] === cst.BLACKSQUARE_CHARACTER) {
                    if (nEmptySquaresRow >= cst.MIN_LETTERS_FOR_WORD) {
                        ++nWordsRow;
                    }
                    nEmptySquaresRow = 0;
                }
                if (this.gridContent[j][i] === cst.EMPTY_SQUARE) {
                    ++nEmptySquaresCol;
                } else if (this.gridContent[j][i] === cst.BLACKSQUARE_CHARACTER) {
                    if (nEmptySquaresCol >= cst.MIN_LETTERS_FOR_WORD) {
                        ++nWordsCol;
                    }
                    nEmptySquaresCol = 0;
                }
            }
            if ((nWordsRow < cst.MIN_WORDS_PER_LINE || nWordsRow > cst.MAX_WORDS_PER_LINE)
                || (nWordsCol < cst.MIN_WORDS_PER_LINE || nWordsCol > cst.MAX_WORDS_PER_LINE)) {
                return false;
            }
        }

        return true;
    }

    private randomPositionGenerator(): PosXY {
        let tempPosition: PosXY = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());

        while (this.isOccupiedPosition(tempPosition)) {
            tempPosition = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());
        }

        return tempPosition;
    }

    private randomIntGenerator(): number {
        return Math.floor(Math.random() * this.sideSize);
    }

    private isOccupiedPosition(position: PosXY): boolean {
        return !(this.gridContent[position.X][position.Y] === cst.EMPTY_SQUARE);
    }

    private startFillingGrid(): void {
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
                        this.wordLengths.push(new Word(new PosXY(j, i), Orientation.Horizontal, this.generateString(nLettersRow), ""));
                        lastBlacksquarePosRow = i;
                        nLettersRow = 0;
                    }
                }
            }
            if (nLettersCol >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordLengths.push(new Word(new PosXY(i, lastBlacksquarePosCol), Orientation.Vertical, this.generateString(nLettersCol), ""));
            }
            if (nLettersRow >= cst.MIN_LETTERS_FOR_WORD) {
                this.wordLengths.push(new Word(new PosXY(lastBlacksquarePosRow, i), Orientation.Horizontal, this.generateString(nLettersRow), ""));
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
            const currentChar: string = (nextWord.Orientation === Orientation.Vertical) ?
                this.gridContent[nextWord.Position.X][i + nextWord.Position.Y] :
                this.gridContent[nextWord.Position.X + i][nextWord.Position.Y];
            if (currentChar !== cst.EMPTY_SQUARE) {
                constraints.push({position: i, letter: currentChar});
            }
        }

        return constraints;
    }

    private findWordsWithConstraints(length: number, requiredLettersPositions: Constraint[]): DictionaryEntry {

        // QUERY word DB
        // IF no word found THEN
        //    Backtrack

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

    private eliminateSpecialChars(word: string): string {
        const specialChars: RegExp = /[ !@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?]/;

        return word.replace(specialChars, "");
    }

    private replaceAccentedChars(word: string): string {
        const accentedChars: RegExp[] = [/[àÀäÄâÂ]/, /[ÉéêÊèÈëË]/, /[ïÏîÎìÌ]/, /[òÒôÔöÖ]/, /[ùÙüÜûÛ]/, /[çÇ]/];
        const replacementChars: string[] = ["A", "E", "I", "O", "U", "C"];

        for (let i: number = 0; i < accentedChars.length; i++) {
            word = word.replace(accentedChars[i], replacementChars[i]);
        }

        return word;
    }

    private generateString(length: number): string {
        let newStr: string = "";
        for (let i: number = 0; i < length; i++) {
            newStr += (cst.EMPTY_SQUARE);
        }

        return newStr;
    }
}
