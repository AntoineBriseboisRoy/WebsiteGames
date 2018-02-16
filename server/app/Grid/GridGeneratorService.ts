import { Grid } from "./Grid";

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
}
