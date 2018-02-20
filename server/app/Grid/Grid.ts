import { IWord } from "../../../common/Word";
import { BlackSquareGenerator } from "./BlackSquareGenerator";
import { StringService } from "./StringService";
// import { GridFiller } from "./GridFiller";
// import { STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES } from "./Constants";

export class Grid {

    private gridContent: string[][];
    private words: IWord[];

    public constructor(private sideSize: number = 10, private percentageOfBlackSquares: number = 0.4) {
        this.gridContent = BlackSquareGenerator.getInstance(this.sideSize, this.percentageOfBlackSquares).generateBlackSquares();
        // GridFiller.Instance.fillWords(this.gridContent, this.sideSize);
        // this.words = GridFiller.Instance.Words;
        this.cleanGrid();
     }

    public get GridContent(): string[][] {
        return this.gridContent;
    }

    public get Words(): IWord[] {
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
                letter = letter.toUpperCase();
            });
        });
    }
}
