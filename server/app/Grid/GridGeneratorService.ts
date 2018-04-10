import { Grid } from "./Grid";
import { IWord } from "../../../common/interfaces/IWord";
import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { Difficulty } from "../../../common/constants";

export class GridGeneratorService {

    private grid: Grid;

    public constructor() {
        this.grid = new Grid(Difficulty.Easy);
    }

    public async createGrid(difficulty: Difficulty): Promise<void> {
        this.grid = new Grid(difficulty);
        await this.grid.fillGrid();
    }

    public get Grid(): string {
        return this.grid.GridContent.toString().toUpperCase().replace(/,/gi, "");
    }

    public get Words(): Array<IWord> {
        return this.grid.Words;
    }

    // tslint:disable-next-line:max-func-body-length
    public getFakeGridWords(): Array<IWord> {
        return [
            { position: { x: 2, y: 2} as ICoordXY, orientation: 1, content: "RESINATE", definition: "1cpascompliquectunmot"},
            { position: { x: 2, y: 0} as ICoordXY, orientation: 0, content: "MARACA", definition: "2cpascompliquectunmot"},
            { position: { x: 4, y: 1} as ICoordXY, orientation: 0, content: "MS", definition: "3cpascompliquectunmot"},
            { position: { x: 7, y: 2} as ICoordXY, orientation: 0, content: "ARS", definition: "4cpascompliquectunmot"},
            { position: { x: 2, y: 4} as ICoordXY, orientation: 1, content: "CONTEST", definition: "5cpascompliquectunmot"},
            { position: { x: 6, y: 0} as ICoordXY, orientation: 0, content: "LANAE", definition: "6cpascompliquectunmot"},
            { position: { x: 6, y: 3} as ICoordXY, orientation: 1, content: "AR", definition: "7cpascompliquectunmot"},
            { position: { x: 0, y: 0} as ICoordXY, orientation: 1, content: "RAMA", definition: "8cpascompliquectunmot"},
            { position: { x: 1, y: 5} as ICoordXY, orientation: 1, content: "JA", definition: "9cpascompliquectunmot"},
            { position: { x: 0, y: 3} as ICoordXY, orientation: 1, content: "YEA", definition: "10cpascompliquectunmot"},
            { position: { x: 0, y: 0} as ICoordXY, orientation: 0, content: "ROSY", definition: "11cpascompliquectunmot"},
            { position: { x: 0, y: 1} as ICoordXY, orientation: 1, content: "OCA", definition: "12cpascompliquectunmot"},
            { position: { x: 1, y: 0} as ICoordXY, orientation: 0, content: "AC", definition: "13cpascompliquectunmot"},
            { position: { x: 8, y: 4} as ICoordXY, orientation: 0, content: "TIDI", definition: "14cpascompliquectunmot"},
            { position: { x: 4, y: 4} as ICoordXY, orientation: 0, content: "NF", definition: "15cpascompliquectunmot"},
            { position: { x: 6, y: 0} as ICoordXY, orientation: 1, content: "LN", definition: "16cpascompliquectunmot"},
            { position: { x: 1, y: 5} as ICoordXY, orientation: 0, content: "JOBS", definition: "17cpascompliquectunmot"},
            { position: { x: 8, y: 5} as ICoordXY, orientation: 1, content: "IY", definition: "18cpascompliquectunmot"},
            { position: { x: 7, y: 6} as ICoordXY, orientation: 1, content: "VDE", definition: "19cpascompliquectunmot"},
            { position: { x: 9, y: 5} as ICoordXY, orientation: 0, content: "YES", definition: "20cpascompliquectunmot"},
            { position: { x: 7, y: 7} as ICoordXY, orientation: 1, content: "BIS", definition: "21cpascompliquectunmot"},
            { position: { x: 7, y: 6} as ICoordXY, orientation: 0, content: "VB", definition: "22cpascompliquectunmot"},
            { position: { x: 0, y: 7} as ICoordXY, orientation: 1, content: "WB", definition: "23cpascompliquectunmot"},
            { position: { x: 0, y: 8} as ICoordXY, orientation: 1, content: "USABLY", definition: "24cpascompliquectunmot"},
            { position: { x: 0, y: 7} as ICoordXY, orientation: 0, content: "WUN", definition: "25cpascompliquectunmot"},
            { position: { x: 5, y: 8} as ICoordXY, orientation: 0, content: "YS", definition: "26cpascompliquectunmot"},
            { position: { x: 3, y: 7} as ICoordXY, orientation: 0, content: "RB", definition: "27cpascompliquectunmot"},
            { position: { x: 4, y: 7} as ICoordXY, orientation: 0, content: "ALO", definition: "28cpascompliquectunmot"},
            { position: { x: 4, y: 9} as ICoordXY, orientation: 1, content: "OSKAR", definition: "29cpascompliquectunmot"},
            { position: { x: 3, y: 7} as ICoordXY, orientation: 1, content: "RA", definition: "30cpascompliquectunmot"}
        ] as Array<IWord>;
    }

    public getFakeGridContent(): string {
        return "RAMA**LN**OCA*M*A***S*RESINATEYEA***AR****CONTEST**JA*F***IY*O*****VDEWB*RA**BISUSABLY****N***OSKAR*";
    }
}
