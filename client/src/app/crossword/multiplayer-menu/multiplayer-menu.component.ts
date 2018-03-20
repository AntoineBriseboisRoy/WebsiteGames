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
    private createdGameSubject: Subject<INewGame>;
    private deletedGameSubject: Subject<INewGame>;
    private difficulty: Difficulty;

    public constructor(private socketService: SocketIoService, public waitingGames: MultiplayerGamesService) {
        this.createdGameSubject = this.socketService.createNewGame();
        this.createdGameSubject.subscribe((newGame: INewGame) => {
            this.waitingGames.push(newGame);
        });
        this.deletedGameSubject = this.socketService.deleteCreatedGame();
        this.deletedGameSubject.subscribe((deletedGame: INewGame) => {
            this.waitingGames.remove(deletedGame);
        });
    }

    public onButtonGroupClick($event: Event): void {
        const clickedElement: Element = $event.srcElement;
        if (clickedElement.nodeName === "BUTTON") {
            const button: Element = this.alreadySelectedButton(clickedElement);
            if (button) {
                button.classList.remove("active");
            }
            clickedElement.className += " active";
        }
    }

    private alreadySelectedButton(clickedElement: Element): Element {
        return clickedElement.parentElement.parentElement.querySelector(".active");
    }

    public difficultySelected(eventTarget: EventTarget): void {
        this.difficulty = ((eventTarget as HTMLButtonElement).value as Difficulty);
    }

    public hasCompletedForm(): boolean {
        return this.difficulty !== undefined && this.username !== undefined && this.username !== "" &&
               !this.waitingGames.isWaiting();
    }

    public createNewGame(): void {
        this.waitingGames.createdGame = { userCreator: this.username, difficulty: this.difficulty };
        this.waitingGames.push(this.waitingGames.createdGame);
        this.createdGameSubject.next(this.waitingGames.createdGame);
    }

    public deleteGame(): void {
        this.waitingGames.remove(this.waitingGames.createdGame);
        this.deletedGameSubject.next(this.waitingGames.createdGame);
        this.waitingGames.createdGame = undefined;
    }
}
