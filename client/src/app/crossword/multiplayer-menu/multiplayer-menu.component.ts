import { Component, HostListener } from "@angular/core";
import { SocketIoService } from "../socket-io.service";
import { INewGame } from "../../../../../common/interfaces/INewGame";
import { Difficulty } from "../../constants";
import { MultiplayerGamesService } from "./multiplayer-games.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-multiplayer-menu",
    templateUrl: "./multiplayer-menu.component.html",
    styleUrls: ["./multiplayer-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class MultiplayerMenuComponent {
    public username: string;
    private difficulty: Difficulty;

    public constructor(private socketService: SocketIoService, public waitingGames: MultiplayerGamesService,
                       private router: Router) {
        this.socketService.init();
        this.socketService.CreatedGameSubject.subscribe((newGame: INewGame) => {
            this.waitingGames.push(newGame);
        });

        this.socketService.DeletedGameSubject.subscribe((deletedGame: INewGame) => {
            this.waitingGames.remove(deletedGame);
        });
        this.socketService.PlayGameSubject.subscribe((gameToPlay: INewGame) => {
            if (this.waitingGames.canJoinGame(gameToPlay)) {
                this.waitingGames.setGame(gameToPlay);
                this.router.navigate(["/crossword/play"]);
            }
        });
    }

    @HostListener("window:beforeunload", ["$event"])
    public handleDestroyedComponent(): void {
        if (this.waitingGames.isWaiting()) {
            this.deleteGame();
        }
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
        if (this.waitingGames.isUsernameUnique(this.username)) {
            this.waitingGames.createdGame = { userCreator: this.username, difficulty: this.difficulty };
            this.waitingGames.push(this.waitingGames.createdGame);
            this.socketService.CreatedGameSubject.next(this.waitingGames.createdGame);
        } else {
            console.error("problem creating a game");
        }
    }

    public deleteGame(): void {
        this.waitingGames.remove(this.waitingGames.createdGame);
        this.socketService.DeletedGameSubject.next(this.waitingGames.createdGame);
        this.waitingGames.createdGame = undefined;
    }
}
