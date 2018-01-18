class GridGeneratorService {

    private instance: GridGeneratorService;
    private grid: Grid;

    private constructor() { }

    public getInstance(): GridGeneratorService {
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
