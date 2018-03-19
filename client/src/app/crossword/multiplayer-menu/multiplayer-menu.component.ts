import { Component } from "@angular/core";
import { SocketIoService } from "../socket-io.service";
import { Subject } from "rxjs/Subject";
import { INewGame } from "../../../../../common/interfaces/INewGame";
import { Difficulty } from "../../constants";
import { MultiplayerGamesService } from "./multiplayer-games.service";

@Component({
    selector: "app-multiplayer-menu",
    templateUrl: "./multiplayer-menu.component.html",
    styleUrls: ["./multiplayer-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class MultiplayerMenuComponent {
    public username: string;
    private gamesService: Subject<INewGame>;
    public constructor(private socketService: SocketIoService, public waitingGames: MultiplayerGamesService) {
        this.gamesService = this.socketService.connect();
        this.gamesService.subscribe((newGame: INewGame) => {
            this.waitingGames.push(newGame);
        });
    }

    public createNewGame(): void {
        this.waitingGames.push({ userCreator: this.username, difficulty: Difficulty.Easy });
        this.gamesService.next({ userCreator: this.username, difficulty: Difficulty.Easy });
    }
}
