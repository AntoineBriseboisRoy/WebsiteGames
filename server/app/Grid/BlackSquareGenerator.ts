import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { Orientation, IWord } from "../../../common/interfaces/IWord";
import { StringService } from "./StringService";
import { EMPTY_SQUARE, BLACKSQUARE_CHARACTER, MIN_LETTERS_FOR_WORD, MIN_WORDS_PER_LINE,
         MAX_WORDS_PER_LINE, MAX_BLACKSQUARE_RATIO } from "./Constants";
export class BlackSquareGenerator {

    private blackSquares: ICoordXY[];
    private grid: string[][];
    private nTotalWords: number;
    private connectedWordsFound: IWord[];

    public constructor(private sideSize: number, private percentageOfBlackSquares: number) {
        this.blackSquares = new Array<ICoordXY>();
        this.grid = this.initializeEmptyGrid();
    }

    private initializeEmptyGrid(): string[][] {
        const emptyGrid: string[][] = new Array();
        for (let i: number = 0; i < this.sideSize; i++) {
            emptyGrid[i] = new Array<string>();
            for (let j: number = 0; j < this.sideSize; j++) {
                emptyGrid[i][j] = EMPTY_SQUARE;
            }
        }

        return emptyGrid;
    }

    public generateBlackSquares(): string[][] {
        const numberOfBlackSquaresPerLine: number = this.percentageOfBlackSquares * this.sideSize;
        do {
            this.grid = this.initializeEmptyGrid();

            for (let i: number = 0; i < this.sideSize; i++) {
                for (let j: number = 0; j < numberOfBlackSquaresPerLine; j++) {
                    const tempPosition: ICoordXY = this.randomPositionGenerator();
                    this.blackSquares.push(tempPosition);
                    this.grid[tempPosition.x][tempPosition.y] = BLACKSQUARE_CHARACTER;
                }
            }
        } while (!this.verifyBlackSquareGrid());

        return this.grid;
    }

    private isOccupiedPosition(position: ICoordXY): boolean {
        return !(this.grid[position.x][position.y] === EMPTY_SQUARE);
    }

    private randomIntGenerator(): number {
        return Math.floor(Math.random() * this.sideSize);
    }

    private randomPositionGenerator(): ICoordXY {
        let tempPosition: ICoordXY = { x: Math.abs(Math.floor(this.randomIntGenerator())),
                                       y: Math.abs(Math.floor(this.randomIntGenerator()))} as ICoordXY;

        while (this.isOccupiedPosition(tempPosition)) {
            tempPosition = { x: Math.abs(Math.floor(this.randomIntGenerator())),
                             y: Math.abs(Math.floor(this.randomIntGenerator()))} as ICoordXY;
        }

        return tempPosition;
    }

    private verifyBlackSquareGrid(): boolean {
        return this.correctBlackSquareRatio() && this.correctNumberWordsPerRowColumn() && this.allWordsConnected();
    }

    private allWordsConnected(): boolean {
        return (this.countConnectedWords() === this.nTotalWords);
    }

    private findFirstWord(): IWord {
        for (let i: number = 0; i < this.sideSize; ++i) {
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === EMPTY_SQUARE) {
                    let nLettersRow: number = 0;
                    while (++nLettersRow + j < this.sideSize && this.grid[i][j + nLettersRow] === EMPTY_SQUARE) {
                        if (nLettersRow >= MIN_LETTERS_FOR_WORD - 1) {
                            return { position: { x: i, y: j} as ICoordXY,
                                     orientation: Orientation.Vertical, content: "", definition: "" } as IWord;
                        }
                    }
                    let nLettersCol: number = 0;
                    while (++nLettersCol + i < this.sideSize && this.grid[i + nLettersCol][j] === EMPTY_SQUARE) {
                        if (nLettersCol >= MIN_LETTERS_FOR_WORD - 1) {
                            return { position: { x: i, y: j} as ICoordXY,
                                     orientation: Orientation.Horizontal, content: "", definition: "" } as IWord;
                        }
                    }
                }
            }
        }
    }

    private countConnectedWords(): number {
        this.connectedWordsFound = new Array<IWord>();

        return this.countConnectedWordsRecursive(this.findFirstWord());
    }

    // tslint:disable-next-line:max-func-body-length
    private countConnectedWordsRecursive(currChar: IWord): number {
        if (this.charBelongsToAlreadyCheckedWord(currChar)) {
            return 0;
        }

        const charsToCheck: IWord[] = new Array<IWord>();
        let nWordsConnected: number = 1;
        let currWordPosition: ICoordXY, currWordLength: number = 0;

        if (currChar.orientation === Orientation.Horizontal) {
            let i: number = currChar.position.x;
            while (--i >= 0 && this.grid[i][currChar.position.y] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(i)),
                                                y: Math.abs(Math.floor(currChar.position.y))} as ICoordXY,
                                              currChar.orientation)) {
                    charsToCheck.push({ position: { x: i, y: currChar.position.y} as ICoordXY,
                                        orientation: Orientation.Vertical, content: "", definition: "" });
                }
            }
            currWordPosition = { x: Math.abs(Math.floor(i + 1)),
                                 y: Math.abs(Math.floor(currChar.position.y))} as ICoordXY;
            i = currChar.position.x;
            while (++i < this.sideSize && this.grid[i][currChar.position.y] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(i)),
                                                y: Math.abs(Math.floor(currChar.position.y))} as ICoordXY,
                                              currChar.orientation)) {
                    charsToCheck.push({ position: { x: i, y: currChar.position.y} as ICoordXY,
                                        orientation: Orientation.Vertical, content: "", definition: "" });
                }
            }
            currWordLength = i - currWordPosition.x;
        } else {
            let i: number = currChar.position.y;
            while (--i >= 0 && this.grid[currChar.position.x][i] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(currChar.position.x)),
                                                y: Math.abs(Math.floor(i))} as ICoordXY,
                                              currChar.orientation)) {
                    charsToCheck.push({ position: { x: currChar.position.x, y: i} as ICoordXY,
                                        orientation: Orientation.Horizontal, content: "", definition: "" });
                }
            }
            currWordPosition = { x: currChar.position.x, y: i + 1} as ICoordXY;
            i = currChar.position.y;
            while (++i < this.sideSize && this.grid[currChar.position.x][i] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(currChar.position.x)),
                                                y: Math.abs(Math.floor(i))} as ICoordXY,
                                              currChar.orientation)) {
                    charsToCheck.push({ position: { x: currChar.position.x, y: i} as ICoordXY,
                                        orientation: Orientation.Horizontal, content: "", definition: "" });
                }
            }
            currWordLength = i - currWordPosition.y;
        }
        this.connectedWordsFound.push({position: currWordPosition, orientation: currChar.orientation,
                                       content: StringService.generateDefaultString(currWordLength), definition: ""});

        charsToCheck.forEach((char: IWord) => {
            nWordsConnected += this.countConnectedWordsRecursive(char);
        });

        return nWordsConnected;
    }

    private charBelongsToAlreadyCheckedWord(currChar: IWord): boolean {
        let alreadyConnected: boolean = false;
        this.connectedWordsFound.forEach((word: IWord) => {
            if (currChar.orientation === word.orientation) {
                if (currChar.orientation === Orientation.Horizontal) {
                    if (word.position.y === currChar.position.y && word.position.x <= currChar.position.x
                        && word.position.x + word.content.length >= currChar.position.x) {
                        alreadyConnected = true;
                    }
                } else {
                    if (word.position.x === currChar.position.x && word.position.y <= currChar.position.y
                        && word.position.y + word.content.length >= currChar.position.y) {
                        alreadyConnected = true;
                    }
                }
            }
        });

        return alreadyConnected;
    }

    private checkAdjacentSquares(currSquare: ICoordXY, orientation: Orientation): boolean {
        if (orientation === Orientation.Vertical) {
            if (currSquare.x < this.sideSize - 1 && this.grid[currSquare.x + 1][currSquare.y] === EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ position: currSquare, orientation: Orientation.Horizontal,
                                                            content: "", definition: "" })) {
                    return true;
                }
            }
            if (currSquare.x > 0 && this.grid[currSquare.x - 1][currSquare.y] === EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ position: currSquare, orientation: Orientation.Horizontal,
                                                            content: "", definition: "" })) {
                    return true;
                }
            }
        } else {
            if (currSquare.y < this.sideSize - 1 && this.grid[currSquare.x][currSquare.y + 1] === EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ position: currSquare, orientation: Orientation.Vertical,
                                                            content: "", definition: "" })) {
                    return true;
                }
            }
            if (currSquare.y > 0 && this.grid[currSquare.x][currSquare.y - 1] === EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ position: currSquare, orientation: Orientation.Horizontal,
                                                            content: "", definition: "" })) {
                        return true;
                }
            }
        }

        return false;
    }

    // tslint:disable-next-line:max-func-body-length
    private correctNumberWordsPerRowColumn(): boolean {
        this.nTotalWords = 0;
        let correctRatio: boolean = true;
        for (let i: number = 0; i < this.sideSize; ++i) {
            let nLettersRow: number = 0, nLettersCol: number = 0, nWordsCol: number = 0, nWordsRow: number = 0;
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === EMPTY_SQUARE) {
                    ++nLettersCol;
                } else {
                    if (nLettersCol >= MIN_LETTERS_FOR_WORD) {
                        ++nWordsCol;
                    }
                    nLettersCol = 0;
                }
                if (this.grid[j][i] === EMPTY_SQUARE) {
                    ++nLettersRow;
                } else {
                    if (nLettersRow >= MIN_LETTERS_FOR_WORD) {
                        ++nWordsRow;
                    }
                    nLettersRow = 0;
                }
            }
            if (nLettersCol >= MIN_LETTERS_FOR_WORD) {
                ++nWordsCol;
            }
            if (nLettersRow >= MIN_LETTERS_FOR_WORD) {
                ++nWordsRow;
            }
            if (!(nWordsRow >= MIN_WORDS_PER_LINE && nWordsRow <= MAX_WORDS_PER_LINE
                && nWordsCol >= MIN_WORDS_PER_LINE && nWordsCol <= MAX_WORDS_PER_LINE)) {
                    correctRatio = false;
            }
            this.nTotalWords += nWordsRow + nWordsCol;
        }

        return correctRatio;
    }

    private correctBlackSquareRatio(): boolean {
        for (let i: number = 0; i < this.sideSize; i++) {
            let nBlackSquaresRow: number = 0, nBlackSquaresCol: number = 0;
            for (let j: number = 0; j < this.sideSize; j++) {
                if (this.grid[i][j] === BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresRow;
                }
                if (this.grid[j][i] === BLACKSQUARE_CHARACTER) {
                    ++nBlackSquaresCol;
                }
            }
            if (this.tooManyBlackSquares(nBlackSquaresCol, nBlackSquaresRow)) {
                return false;
            }
        }

        return true;
    }

    private tooManyBlackSquares(nBlackSquaresCol: number, nBlackSquaresRow: number): boolean {
        return nBlackSquaresCol / this.sideSize > MAX_BLACKSQUARE_RATIO || nBlackSquaresRow / this.sideSize > MAX_BLACKSQUARE_RATIO;
    }
// tslint:disable-next-line:max-file-line-count
}
