import { IWord } from "../../../common/interfaces/IWord";
import { BlackSquareGenerator } from "./BlackSquareGenerator";
import { StringService } from "./StringService";
import { GridFiller } from "./GridFiller";
import { STANDARD_SIDE_SIZE, PERCENTAGE_BLACK_SQUARES } from "./Constants";
import { Difficulty } from "../Services/LexicalService/LexicalService";

export class Grid {

    private gridContent: string[][];
    private words: IWord[];

    public constructor(private difficulty: Difficulty, private sideSize: number = STANDARD_SIDE_SIZE,
                       private percentageOfBlackSquares: number = PERCENTAGE_BLACK_SQUARES) {

    }

    public async fillGrid(): Promise<void> {
        const blackSquareGenerator: BlackSquareGenerator = new BlackSquareGenerator(this.sideSize, this.percentageOfBlackSquares);
        this.gridContent = blackSquareGenerator.Content;
        const gridFiller: GridFiller = new GridFiller();
        this.words = await gridFiller.fillWords(this.gridContent, this.sideSize, this.difficulty, blackSquareGenerator.WordsToFill);
        this.gridContent = gridFiller.Content;
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
