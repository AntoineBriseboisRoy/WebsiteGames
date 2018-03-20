import { Component } from "@angular/core";
import { MultiplayerGamesService } from "../multiplayer-games.service";
import { SocketIoService } from "../../socket-io.service";
import { INewGame } from "../../../../../../common/interfaces/INewGame";
import { Router } from "@angular/router";

@Component({
    selector: "app-waiting-games",
    templateUrl: "./waiting-games.component.html",
    styleUrls: ["./waiting-games.component.css"]
})
export class WaitingGamesComponent {

    public userJoiner: Array<string>;
    public constructor(public waitingGames: MultiplayerGamesService, private socketIO: SocketIoService,
                       private router: Router) {
        this.userJoiner = new Array<string>(this.waitingGames.Games.length);
    }

    private isJoinerDefined(index: number): boolean {
        return this.userJoiner[index] !== undefined && this.userJoiner[index] !== "";
    }
    public canJoinGame(index: number): boolean {
        return this.isJoinerDefined(index) && !this.waitingGames.isWaiting();
    }
    public joinGame(index: number): void {
        const gameToPlay: INewGame = { userCreator: this.waitingGames.Games[index].userCreator,
                                       difficulty: this.waitingGames.Games[index].difficulty,
                                       userJoiner: this.userJoiner[index]};
        this.waitingGames.setGame(gameToPlay);
        this.socketIO.PlayGameSubject.next(gameToPlay);
        this.router.navigate(["/crossword/play"]);
    }
}
