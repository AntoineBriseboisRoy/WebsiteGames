import { IGameInProgress } from "../../../common/interfaces/IGameInProgress";
import { GridGeneratorService } from "../Grid/GridGeneratorService";

export class GamesInProgressService {
    private static instance: GamesInProgressService;
    private gamesInProgress: Array<IGameInProgress>;

    private constructor() {
        this.gamesInProgress = new Array<IGameInProgress>();
    }

    public static get Instance(): GamesInProgressService {
        if (!this.instance) {
            this.instance = new GamesInProgressService();
        }

        return this.instance;
    }
    public getGameInProgress(socketId: string): IGameInProgress {
        return this.gamesInProgress.find((game: IGameInProgress) => game.roomName === socketId);
    }
    public createNewGame(socketId: string): IGameInProgress {
        this.gamesInProgress.push({
            roomName: socketId,
            gridWords: GridGeneratorService.Instance.getFakeGridWords(),
            gridContent: GridGeneratorService.Instance.getFakeGridContent()
        });

        return this.gamesInProgress[this.gamesInProgress.length - 1];
    }
}
