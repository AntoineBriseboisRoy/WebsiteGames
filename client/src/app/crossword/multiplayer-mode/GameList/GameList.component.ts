import { Component } from "@angular/core";
import { GameRoomManagerService } from "../GameRoomManagerService.service";
import { SocketIoService } from "../../socket-io.service";
import { INewGame } from "../../../../../../common/interfaces/INewGame";
import { Router } from "@angular/router";

@Component({
    selector: "app-waiting-games",
    templateUrl: "./GameList.component.html",
    styleUrls: ["./GameList.component.css"]
})
export class GameListComponent {

    public userJoiner: Array<string>;
    public constructor(public gameRooms: GameRoomManagerService, private socketIO: SocketIoService,
                       private router: Router) {
        this.userJoiner = new Array<string>(this.gameRooms.Games.length);
    }

    private isJoinerDefined(index: number): boolean {
        return this.userJoiner[index] !== undefined && this.userJoiner[index] !== "";
    }
    public canJoinGame(index: number): boolean {
        return this.isJoinerDefined(index) && !this.gameRooms.isDefined();
    }
    public joinGame(index: number): void {
        const gameToPlay: INewGame = { userCreator: this.gameRooms.Games[index].userCreator,
                                       difficulty: this.gameRooms.Games[index].difficulty,
                                       userJoiner: this.userJoiner[index]};
        this.gameRooms.setGame(gameToPlay);
        this.socketIO.PlayGameSubject.next(gameToPlay);
        this.router.navigate(["/crossword/play"]);
    }
}
