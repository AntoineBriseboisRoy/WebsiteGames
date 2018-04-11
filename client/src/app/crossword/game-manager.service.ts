import { Difficulty } from "../../../../common/constants";
import { IPlayer } from "../../../../common/interfaces/IPlayer";
import { SocketIoService } from "./socket-io.service";
import { Injectable } from "@angular/core";

@Injectable()
export class GameManagerService {

    public isMultiplayer: boolean;
    public difficulty: Difficulty;
    public players: Array<IPlayer>;

    public constructor(private socketIO: SocketIoService) {
        this.players = [ { username: "Player One", score: 0 }, { username: "Player Two", score: 0 } ];
        this.difficulty = Difficulty.Easy;
        this.isMultiplayer = false;
        this.fetchPlayerScores();
    }

    private fetchPlayerScores(): void {
        this.socketIO.Score.subscribe((iPlayers: Array<IPlayer>) => {
            this.players = iPlayers;
        });
    }
}
