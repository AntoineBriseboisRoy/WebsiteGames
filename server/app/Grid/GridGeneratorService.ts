import { Grid } from "./Grid";
import { Word } from "./Word";
import { CoordXY } from "./CoordXY";

export class GridGeneratorService {

    private static instance: GridGeneratorService;
    private grid: Grid;

    private constructor() {
        this.grid = new Grid();
    }

    public static get Instance(): GridGeneratorService {
        if (!this.instance) {
            this.instance = new GridGeneratorService();
        }

        return this.instance;
    }

    public get Grid(): string {
        return this.grid.GridContent.toString().replace(",", "");
    }

    public get Words(): string {
        return JSON.stringify(this.grid.Words);
    }

    public generateNewGrid(): void {
        this.grid = new Grid();
    }

    // tslint:disable-next-line:max-func-body-length
    public getFakeGridWords(): string {
        const words: Array<Word> = [new Word(new CoordXY(2, 2), 1, "RESINATE", ""),
                                    new Word(new CoordXY(0, 2), 0, "MARACA", ""),
                                    new Word(new CoordXY(1, 4), 0, "MS", ""),
                                    new Word(new CoordXY(2, 7), 0, "ARS", ""),
                                    new Word(new CoordXY(4, 2), 1, "CONTEST", ""),
                                    new Word(new CoordXY(0, 6), 0, "LANAE", ""),
                                    new Word(new CoordXY(3, 6), 1, "AR", ""),
                                    new Word(new CoordXY(0, 0), 1, "RAMA", ""),
                                    new Word(new CoordXY(5, 1), 1, "JA", ""),
                                    new Word(new CoordXY(3, 0), 1, "YEA", ""),
                                    new Word(new CoordXY(0, 0), 0, "ROSY", ""),
                                    new Word(new CoordXY(1, 0), 1, "OCA", ""),
                                    new Word(new CoordXY(0, 1), 0, "AC", ""),
                                    new Word(new CoordXY(4, 8), 0, "TIDI", ""),
                                    new Word(new CoordXY(4, 4), 0, "NF", ""),
                                    new Word(new CoordXY(0, 6), 1, "LN", ""),
                                    new Word(new CoordXY(5, 1), 0, "JOBS", ""),
                                    new Word(new CoordXY(5, 8), 1, "IY", ""),
                                    new Word(new CoordXY(6, 7), 1, "VDE", ""),
                                    new Word(new CoordXY(5, 9), 0, "YES", ""),
                                    new Word(new CoordXY(7, 7), 1, "BIS", ""),
                                    new Word(new CoordXY(6, 7), 0, "VB", ""),
                                    new Word(new CoordXY(7, 0), 1, "WB", ""),
                                    new Word(new CoordXY(8, 0), 1, "USABLY", ""),
                                    new Word(new CoordXY(7, 0), 0, "WUN", ""),
                                    new Word(new CoordXY(8, 5), 0, "YS", ""),
                                    new Word(new CoordXY(7, 3), 0, "RB", ""),
                                    new Word(new CoordXY(7, 4), 0, "ALO", ""),
                                    new Word(new CoordXY(9, 4), 1, "OSKAR", ""),
                                    new Word(new CoordXY(7, 3), 1, "RA", "")];

        return JSON.stringify(words);
    }

    public getFakeGridContent(): string {
        return "RAMA**LN**OCA*M*A***S*RESINATEYEA***AR****CONTEST**JA*F***IY*O*****VDEWB*RA**BISUSABLY****N***OSKAR*";
    }
}
