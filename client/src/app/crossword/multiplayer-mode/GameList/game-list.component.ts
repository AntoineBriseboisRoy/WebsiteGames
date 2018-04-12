import { Component } from "@angular/core";
import { GameRoomManagerService } from "../game-room-manager.service";
import { SocketIoService } from "../../socket-io.service";
import { INewGame } from "../../../../../../common/interfaces/INewGame";
import { Router } from "@angular/router";
import { Difficulty } from "../../../../../../common/constants";
import { DifficultyView } from "../../../constants";

@Component({
    selector: "app-game-list",
    templateUrl: "./game-list.component.html"
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
        const gameToPlay: INewGame = {
            userCreator: this.gameRooms.Games[index].userCreator,
            difficulty: this.gameRooms.Games[index].difficulty,
            userJoiner: this.userJoiner[index],
            userCreatorID: this.gameRooms.Games[index].userCreatorID
        };
        this.gameRooms.setGame(gameToPlay);
        this.socketIO.PlayMultiplayerGameSubject.next(gameToPlay);
        this.router.navigate(["/crossword/play"]);
    }
    public viewDifficulty(difficulty: Difficulty): string {
        switch (difficulty) {
            case Difficulty.Easy: {
                return DifficultyView.Easy;
            }
            case Difficulty.Medium: {
                return DifficultyView.Medium;
            }
            case Difficulty.Hard: {
                return DifficultyView.Hard;
            }
            default: break;
        }

        return "";
    }
}
