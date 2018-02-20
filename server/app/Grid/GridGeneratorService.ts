import { Grid } from "./Grid";
import { IWord } from "../../../common/Word";
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
    public getFakeGridWords(): Array<IWord> {
        return [
            { position: new CoordXY(2, 2), orientation: 1, content: "RESINATE", definition: "cpascompliquectunmot"},
            { position: new CoordXY(0, 2), orientation: 0, content: "MARACA", definition: "cpascompliquectunmot"},
            { position: new CoordXY(1, 4), orientation: 0, content: "MS", definition: "cpascompliquectunmot"},
            { position: new CoordXY(2, 7), orientation: 0, content: "ARS", definition: "cpascompliquectunmot"},
            { position: new CoordXY(4, 2), orientation: 1, content: "CONTEST", definition: "cpascompliquectunmot"},
            { position: new CoordXY(0, 6), orientation: 0, content: "LANAE", definition: "cpascompliquectunmot"},
            { position: new CoordXY(3, 6), orientation: 1, content: "AR", definition: "cpascompliquectunmot"},
            { position: new CoordXY(0, 0), orientation: 1, content: "RAMA", definition: "cpascompliquectunmot"},
            { position: new CoordXY(5, 1), orientation: 1, content: "JA", definition: "cpascompliquectunmot"},
            { position: new CoordXY(3, 0), orientation: 1, content: "YEA", definition: "cpascompliquectunmot"},
            { position: new CoordXY(0, 0), orientation: 0, content: "ROSY", definition: "cpascompliquectunmot"},
            { position: new CoordXY(1, 0), orientation: 1, content: "OCA", definition: "cpascompliquectunmot"},
            { position: new CoordXY(0, 1), orientation: 0, content: "AC", definition: "cpascompliquectunmot"},
            { position: new CoordXY(4, 8), orientation: 0, content: "TIDI", definition: "cpascompliquectunmot"},
            { position: new CoordXY(4, 4), orientation: 0, content: "NF", definition: "cpascompliquectunmot"},
            { position: new CoordXY(0, 6), orientation: 1, content: "LN", definition: "cpascompliquectunmot"},
            { position: new CoordXY(5, 1), orientation: 0, content: "JOBS", definition: "cpascompliquectunmot"},
            { position: new CoordXY(5, 8), orientation: 1, content: "IY", definition: "cpascompliquectunmot"},
            { position: new CoordXY(6, 7), orientation: 1, content: "VDE", definition: "cpascompliquectunmot"},
            { position: new CoordXY(5, 9), orientation: 0, content: "YES", definition: "cpascompliquectunmot"},
            { position: new CoordXY(7, 7), orientation: 1, content: "BIS", definition: "cpascompliquectunmot"},
            { position: new CoordXY(6, 7), orientation: 0, content: "VB", definition: "cpascompliquectunmot"},
            { position: new CoordXY(7, 0), orientation: 1, content: "WB", definition: "cpascompliquectunmot"},
            { position: new CoordXY(8, 0), orientation: 1, content: "USABLY", definition: "cpascompliquectunmot"},
            { position: new CoordXY(7, 0), orientation: 0, content: "WUN", definition: "cpascompliquectunmot"},
            { position: new CoordXY(8, 5), orientation: 0, content: "YS", definition: "cpascompliquectunmot"},
            { position: new CoordXY(7, 3), orientation: 0, content: "RB", definition: "cpascompliquectunmot"},
            { position: new CoordXY(7, 4), orientation: 0, content: "ALO", definition: "cpascompliquectunmot"},
            { position: new CoordXY(9, 4), orientation: 1, content: "OSKAR", definition: "cpascompliquectunmot"},
            { position: new CoordXY(7, 3), orientation: 1, content: "RA", definition: "cpascompliquectunmot"}
        ] as Array<IWord>;

        /*return [new Word(new CoordXY(2, 2), 1, "RESINATE", ""),
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
                new Word(new CoordXY(7, 3), 1, "RA", "")];*/
    }

    public getFakeGridContent(): string {
        return "RAMA**LN**OCA*M*A***S*RESINATEYEA***AR****CONTEST**JA*F***IY*O*****VDEWB*RA**BISUSABLY****N***OSKAR*";
    }
}
