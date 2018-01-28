import { BlackSquare } from "./BlackSquare";
import { PosXY } from './PosXY';
import { Word, Orientation } from './Word';
import { Dictionary } from './Dictionary';

// Should be centralized
const BLACKSQUARE_CHARACTER: string = "*";
const EMPTY_SQUARE: string = "#";
const MIN_LETTERS_FOR_WORD: number = 2;
const MIN_WORDS_PER_LINE: number = 1;
const MAX_WORDS_PER_LINE: number = 3;
const MAX_BLACKSQUARE_RATIO: number = 0.4;

type WordDefinitionTuple = [string, string];

interface DictionaryEntry {
    word: string;
    definition: string;
}

interface Constraint {
    letter: string;
    position: number;
}

export class Grid {

    private gridContent: string[][];
    private blackSquares: BlackSquare[];
    private words: Word[];
    private wordLengths: Word[];

    constructor(private sideSize: number, private percentageOfBlackSquares: number) {
        this.initializeEmptyGrid();
        this.generateBlackSquares();
        this.chooseWordsForGrid();
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

    public getGridLine(lineNumber: number): string[] {
        return this.gridContent[lineNumber];
    }

    private initializeEmptyGrid(): void {
        this.gridContent = new Array(this.sideSize).fill(new Array(this.sideSize).fill(EMPTY_SQUARE));
    }

    private generateBlackSquares(): void {
        this.blackSquares = new Array<BlackSquare>();
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;

        for (let i: number = 0; i < numberOfBlackSquaresPerLine; i++) {
            for (let j: number = 0; j < i; j++) {
                const tempPosition: PosXY = this.randomPositionGenerator();
                this.blackSquares.push(new BlackSquare(tempPosition));
                this.blackSquares.push(new BlackSquare(PosXY.invertCoordinates(tempPosition)));
                this.gridContent[tempPosition.X][tempPosition.Y] = BLACKSQUARE_CHARACTER;
                this.gridContent[tempPosition.Y][tempPosition.X] = BLACKSQUARE_CHARACTER;
            }
        }

        /*let nBlackSquares: number = Math.floor(this.percentageOfBlackSquares * this.sideSize * this.sideSize);
        while (nBlackSquares-- > 0) {
            const tmpPosition: PosXY = this.randomPositionGenerator();
            this.blackSquares.push(new BlackSquare(tmpPosition));
            this.gridContent[tmpPosition.getX()][tmpPosition.getY()] = BLACKSQUARE_CHARACTER;
        }*/
    }

    private verifyBlackSquareGrid(): boolean {
        return this.correctBlackSquareRatio() && this.correctNumberWords();
    }

    private correctBlackSquareRatio(): boolean {

        for (let i: number = 0; i < this.sideSize; i++) {
            let nBlackSquaresRow: number = 0, nBlackSquaresCol: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.gridContent[i][j] === BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresRow;
                }
                if (this.gridContent[j][i] === BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresCol;
                }
            }
            if (nBlackSquaresCol / this.sideSize > MAX_BLACKSQUARE_RATIO || nBlackSquaresRow / this.sideSize > MAX_BLACKSQUARE_RATIO) {
                return false;
            }
        }

        return true;
    }

    // To refactor
    // What happens if no BS is hit?
    private correctNumberWords(): boolean {
        for (let i: number = 0; i < this.sideSize; ++i) {
            let nEmptySquaresRow: number = 0, nWordsRow: number = 0, nEmptySquaresCol: number, nWordsCol: number = 0;
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.gridContent[i][j] === EMPTY_SQUARE) {
                    ++nEmptySquaresRow;
                } else if (this.gridContent[i][j] === BLACKSQUARE_CHARACTER) {
                    if (nEmptySquaresRow >= MIN_LETTERS_FOR_WORD) {
                        ++nWordsRow;
                    }
                    nEmptySquaresRow = 0;
                }
                if (this.gridContent[j][i] === EMPTY_SQUARE) {
                    ++nEmptySquaresCol;
                } else if (this.gridContent[j][i] === BLACKSQUARE_CHARACTER) {
                    if (nEmptySquaresCol >= MIN_LETTERS_FOR_WORD) {
                        ++nWordsCol;
                    }
                    nEmptySquaresCol = 0;
                }
            }
            if ((nWordsRow < MIN_WORDS_PER_LINE || nWordsRow > MAX_WORDS_PER_LINE)
                || (nWordsCol < MIN_WORDS_PER_LINE || nWordsCol > MAX_WORDS_PER_LINE)) {
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
        return !(this.gridContent[position.X][position.Y] === EMPTY_SQUARE);
    }

    private chooseWordsForGrid(): void {
        this.words = new Array<Word>();

        // WHILE Grid is not filled
        //       findLongestFreeSpace
        //       establishConstraints
        //       findWordWithConstraints
        //       addWordToGrid
    }

    // Refactor?
    private establishWordLengths(): void {
        for (let i: number = 0; i < this.sideSize; i++) {
            let nLettersCol: number = 0, nLettersRow: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.gridContent[i][j] === EMPTY_SQUARE) {
                    ++nLettersCol;
                }
                else {
                    if (nLettersCol >= MIN_LETTERS_FOR_WORD){
                        this.wordLengths.push(new Word(new PosXY(i, j), Orientation.Vertical, this.generateString(nLettersCol)));
                        nLettersCol = 0;
                    }
                }
                if (this.gridContent[j][i] === EMPTY_SQUARE){
                    ++nLettersRow;
                }
                else {
                    if (nLettersRow >= MIN_LETTERS_FOR_WORD){
                        this.wordLengths.push(new Word(new PosXY(i, j), Orientation.Vertical, this.generateString(nLettersRow)));
                        nLettersRow = 0;
                    }
                }

                if (nLettersCol >= MIN_LETTERS_FOR_WORD) {
                    this.wordLengths.push(new Word(new PosXY(i, j), Orientation.Vertical, this.generateString(nLettersCol)));
                }
                if (nLettersRow >= MIN_LETTERS_FOR_WORD) {
                    this.wordLengths.push(new Word(new PosXY(i, j), Orientation.Vertical, this.generateString(nLettersRow)));
                }
            }
        }
    }

    private sortWordLengths(): void {
        this.wordLengths.sort((left: Word, right: Word): number => {
            if (left.Length < right.Length){
                return -1;
            }
            if (left.Length > right.Length){
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    private establishConstraints(nextWord: Word): Dictionary<string> {
        let constraints: Dictionary<string> = new Dictionary<string>()

        for (let i = 0; i < nextWord.Length; i++) {
            if (nextWord.Orientation === Orientation.Horizontal) {
                let currentChar: string = this.gridContent[nextWord.Position.X][i + nextWord.Position.Y];
                if (currentChar !== EMPTY_SQUARE) {
                    constraints.add(i, currentChar)
                }
            }
            else {
                this.gridContent[i + nextWord.Position.X][nextWord.Position.Y];
            }
        }

        return constraints;
    }

    private findWordsWithConstraints(length: number, requiredLettersPositions: Constraint[]): WordDefinitionTuple {

        // QUERY word DB
        // IF no word found THEN
        //    Backtrack

        let word: WordDefinitionTuple = this.searchWordsTemporaryDB(length, requiredLettersPositions);
        if (word === null){
            this.backtrack()
        }

        return word;
    }

    //Temporary, to be replaced when we have a lexical service
    private searchWordsTemporaryDB(length: number, requiredLettersPositions: Constraint[]): WordDefinitionTuple {
        let data: DictionaryEntry[] = require("./dbWords.json");
        let searchResults: DictionaryEntry[] = data.filter(entry => this.constraintFilter(entry, length, requiredLettersPositions));
        return searchResults.length === 0 ? null : [searchResults[0].word, searchResults[0].definition];
    }

    private constraintFilter(entry: DictionaryEntry, length: number, requiredLettersPositions: Constraint[]){
        let passesFilter: boolean = true;
        if (entry.word.length != length){
            passesFilter = false;
        }
        requiredLettersPositions.forEach(constraint => {
            if (entry.word[constraint.position] != constraint.letter) {
                passesFilter = false;
            }
        });
        return passesFilter;
    }

    // Should we instead consider removing only words that are connected to the "impossible" one? (And still use reverse order)
    private backtrack(): void {
        let lastWord: Word = this.removeLastWordFromWordArray();
        this.removeLastWordFromGrid(lastWord);
    }

    private removeLastWordFromGrid(lastWord: Word): void {
        for (let i = 0; i < lastWord.Length; i++) {
            if (lastWord.Orientation === Orientation.Horizontal) {
                this.gridContent[lastWord.Position.X][i + lastWord.Position.Y] = EMPTY_SQUARE;
            }
            else {
                this.gridContent[i + lastWord.Position.X][lastWord.Position.Y] = EMPTY_SQUARE;
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
        for (let i = 0; i < length; i++) {
            newStr.concat(EMPTY_SQUARE);
        }
        return newStr;
    }
}
