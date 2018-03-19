import { BlackSquare } from "./BlackSquare";
import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { Orientation, IWord } from "../../../common/interfaces/IWord";
import { StringService } from "./StringService";
import { EMPTY_SQUARE, BLACKSQUARE_CHARACTER, MIN_LETTERS_FOR_WORD, MIN_WORDS_PER_LINE, MAX_WORDS_PER_LINE, MAX_BLACKSQUARE_RATIO } from "./Constants";
export class BlackSquareGenerator {

    private static instance: BlackSquareGenerator;
    private blackSquares: BlackSquare[];
    private grid: string[][];
    private nTotalWords: number;
    private connectedWordsFound: IWord[];

    private constructor(private sideSize: number, private percentageOfBlackSquares: number) {
        this.blackSquares = new Array<BlackSquare>();
        this.grid = this.initializeEmptyGrid();
    }

    public static getInstance(sideSize: number, percentageOfBlackSquares: number): BlackSquareGenerator {
        if (this.mustCreateNewInstance(sideSize, percentageOfBlackSquares)) {
            this.instance = new BlackSquareGenerator(sideSize, percentageOfBlackSquares);
        }

        return this.instance;
    }

    private static mustCreateNewInstance(sideSize: number, percentageOfBlackSquares: number): boolean {
        return this.instance === null || this.instance === undefined || this.instance.sideSize !== sideSize ||
               this.instance.percentageOfBlackSquares !== percentageOfBlackSquares;
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
                    this.blackSquares.push(new BlackSquare(tempPosition));
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

    private findFirstWord(): { coord: ICoordXY, direction: Orientation } {
        for (let i: number = 0; i < this.sideSize; ++i) {
            for (let j: number = 0; j < this.sideSize; ++j) {
                if (this.grid[i][j] === EMPTY_SQUARE) {
                    let nLettersRow: number = 0;
                    while (++nLettersRow + j < this.sideSize && this.grid[i][j + nLettersRow] === EMPTY_SQUARE) {
                        if (nLettersRow >= MIN_LETTERS_FOR_WORD - 1) {
                            return { coord: { x: Math.abs(Math.floor(i)),
                                              y: Math.abs(Math.floor(j))} as ICoordXY,
                                     direction: Orientation.Vertical };
                        }
                    }
                    let nLettersCol: number = 0;
                    while (++nLettersCol + i < this.sideSize && this.grid[i + nLettersCol][j] === EMPTY_SQUARE) {
                        if (nLettersCol >= MIN_LETTERS_FOR_WORD - 1) {
                            return { coord: { x: Math.abs(Math.floor(i)),
                                              y: Math.abs(Math.floor(j))} as ICoordXY,
                                     direction: Orientation.Horizontal };
                        }
                    }
                }
            }
        }

        return { coord: { x: 0, y: 0} as ICoordXY, direction: Orientation.Horizontal };
    }

    private countConnectedWords(): number {
        this.connectedWordsFound = new Array<IWord>();

        return this.countConnectedWordsRecursive(this.findFirstWord());
    }

    // tslint:disable-next-line:max-func-body-length
    private countConnectedWordsRecursive(currChar: { coord: ICoordXY, direction: Orientation }): number {
        if (this.charBelongsToAlreadyCheckedWord(currChar)) {
            return 0;
        }

        const charsToCheck: { coord: ICoordXY, direction: Orientation }[] = new Array<{ coord: ICoordXY, direction: Orientation }>();
        let nWordsConnected: number = 1;
        let currWordPosition: ICoordXY, currWordLength: number = 0;

        if (currChar.direction === Orientation.Horizontal) {
            let i: number = currChar.coord.x;
            while (--i >= 0 && this.grid[i][currChar.coord.y] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(i)),
                                                y: Math.abs(Math.floor(currChar.coord.y))} as ICoordXY,
                                              currChar.direction)) {
                    charsToCheck.push({ coord: { x: Math.abs(Math.floor(i)),
                                                 y: Math.abs(Math.floor(currChar.coord.y))} as ICoordXY,
                                        direction: Orientation.Vertical });
                }
            }
            currWordPosition = { x: Math.abs(Math.floor(i + 1)),
                                 y: Math.abs(Math.floor(currChar.coord.y))} as ICoordXY;
            i = currChar.coord.x;
            while (++i < this.sideSize && this.grid[i][currChar.coord.y] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(i)),
                                                y: Math.abs(Math.floor(currChar.coord.y))} as ICoordXY,
                                              currChar.direction)) {
                    charsToCheck.push({ coord: { x: Math.abs(Math.floor(i)),
                                                 y: Math.abs(Math.floor(currChar.coord.y))} as ICoordXY,
                                        direction: Orientation.Vertical });
                }
            }
            currWordLength = i - currWordPosition.x;
        } else {
            let i: number = currChar.coord.y;
            while (--i >= 0 && this.grid[currChar.coord.x][i] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(currChar.coord.x)),
                                                y: Math.abs(Math.floor(i))} as ICoordXY,
                                              currChar.direction)) {
                    charsToCheck.push({ coord: { x: Math.abs(Math.floor(currChar.coord.x)),
                                                 y: Math.abs(Math.floor(i))} as ICoordXY,
                                        direction: Orientation.Horizontal });
                }
            }
            currWordPosition = { x: Math.abs(Math.floor(currChar.coord.x)),
                                 y: Math.abs(Math.floor(i + 1))} as ICoordXY;
            i = currChar.coord.y;
            while (++i < this.sideSize && this.grid[currChar.coord.x][i] === EMPTY_SQUARE) {
                if (this.checkAdjacentSquares({ x: Math.abs(Math.floor(currChar.coord.x)),
                                                y: Math.abs(Math.floor(i))} as ICoordXY,
                                              currChar.direction)) {
                    charsToCheck.push({ coord: { x: Math.abs(Math.floor(currChar.coord.x)),
                                                 y: Math.abs(Math.floor(i))} as ICoordXY,
                                        direction: Orientation.Horizontal });
                }
            }
            currWordLength = i - currWordPosition.y;
        }
        this.connectedWordsFound.push({position: currWordPosition, orientation: currChar.direction,
                                       content: StringService.generateDefaultString(currWordLength), definition: ""});

        charsToCheck.forEach((char: { coord: ICoordXY, direction: Orientation }) => {
            nWordsConnected += this.countConnectedWordsRecursive(char);
        });

        return nWordsConnected;
    }

    private charBelongsToAlreadyCheckedWord(currChar: { coord: ICoordXY, direction: Orientation }): boolean {
        let alreadyConnected: boolean = false;
        this.connectedWordsFound.forEach((word: IWord) => {
            if (currChar.direction === word.orientation) {
                if (currChar.direction === Orientation.Horizontal) {
                    if (word.position.y === currChar.coord.y && word.position.x <= currChar.coord.x
                        && word.position.x + word.content.length >= currChar.coord.x) {
                        alreadyConnected = true;
                    }
                } else {
                    if (word.position.x === currChar.coord.x && word.position.y <= currChar.coord.y
                        && word.position.y + word.content.length >= currChar.coord.y) {
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
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Horizontal })) {
                    return true;
                }
            }
            if (currSquare.x > 0 && this.grid[currSquare.x - 1][currSquare.y] === EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Horizontal })) {
                    return true;
                }
            }
        } else {
            if (currSquare.y < this.sideSize - 1 && this.grid[currSquare.x][currSquare.y + 1] === EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Vertical })) {
                    return true;
                }
            }
            if (currSquare.y > 0 && this.grid[currSquare.x][currSquare.y - 1] === EMPTY_SQUARE) {
                if (!this.charBelongsToAlreadyCheckedWord({ coord: currSquare, direction: Orientation.Vertical })) {
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
