import { Component } from "@angular/core";
import { SocketIoService } from "../socket-io.service";
import { Subject } from "rxjs/Subject";
import { INewGame } from "../../../../../common/interfaces/INewGame";
import { WaitingGamesService } from "./waiting-games.service";
import { Difficulty } from "../../constants";

@Component({
    selector: "app-multiplayer-menu",
    templateUrl: "./multiplayer-menu.component.html",
    styleUrls: ["./multiplayer-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class MultiplayerMenuComponent {
    public username: string;
    private gamesService: Subject<INewGame>;
    public constructor(private sokectService: SocketIoService, public waitingGames: WaitingGamesService) {
        this.gamesService = this.sokectService.connect();
        this.gamesService.subscribe((msg: INewGame) => {
            console.log(msg);
        });
    }

    public createNewGame(): void {
        this.waitingGames.pushNewGame({ userCreator: this.username, difficulty: Difficulty.Easy });
        this.gamesService.next({ userCreator: this.username, difficulty: Difficulty.Easy });
    }
}
