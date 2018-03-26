import { Difficulty } from "../../../../common/constants";
import { IPlayer } from "../../../../common/interfaces/IPlayer";
import { SocketIoService } from "./socket-io.service";
import { Injectable } from "@angular/core";
@Injectable()
export class GameManagerService {

    public isMultiplayer: boolean;
    public difficulty: Difficulty;
    public playerOne: IPlayer;
    public playerTwo: IPlayer;
    public constructor(private socketIO: SocketIoService) {
        this.playerOne = { username: "Claudia", score: 0 };
        this.playerTwo = { username: "Antoine", score: 0 };
        this.difficulty = Difficulty.Easy;
        this.isMultiplayer = false;
        this.socketIO.Score.subscribe((iPlayers: Array<IPlayer>) => {
            this.playerOne = iPlayers[0];
            if (this.isMultiplayer) {
                this.playerTwo = iPlayers[1];
            }
        });
    }
}
