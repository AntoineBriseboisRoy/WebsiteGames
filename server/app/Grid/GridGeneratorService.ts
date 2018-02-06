import { Grid } from "./Grid";

export class GridGeneratorService {

    private static instance: GridGeneratorService;
    private grid: Grid;

    private constructor() {
        this.grid = new Grid(0, 0);
    }

    public static get Instance(): GridGeneratorService {
        if (this.instance == null) {
            this.instance = new GridGeneratorService();
        }

        return this.instance;
    }

    public get Grid(): Grid {
        return this.grid;
    }

    public generateNewGrid(size: number, percentageBlackSquares: number): Grid {
        this.grid = new Grid(size, percentageBlackSquares);

        return this.grid;
    }
}
