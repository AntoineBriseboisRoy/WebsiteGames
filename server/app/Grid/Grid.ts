import { Word } from "./Word";
import { BlackSquareGenerator } from "./BlackSquareGenerator";
import { StringService } from "./StringService";
import { GridFiller } from "./GridFiller";
import * as cst from "./Constants";

export class Grid {

    private gridContent: string[][];
    private words: Word[];
    private wordLengths: Word[];

    constructor(private sideSize: number, private percentageOfBlackSquares: number, private difficultyLevel: number) { }

    public initialize(): void {
         // do {
            this.gridContent = BlackSquareGenerator.getInstance(this.sideSize, this.percentageOfBlackSquares).Generate();
        // } while (!this.verifyBlackSquareGrid());
            this.gridContent = GridFiller.Instance.fill(this.gridContent, this.difficultyLevel, this.sideSize);
            this.words = GridFiller.Instance.Words;
            this.cleanGrid();
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

    private cleanGrid(): void {
        this.gridContent.forEach((row: string[]) => {
            row.forEach((letter: string) => {
                letter = StringService.eliminateSpecialChars(letter);
                letter = StringService.replaceAccentedChars(letter);
            });
        });
    }
}
