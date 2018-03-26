import { Component, HostListener } from "@angular/core";
import { SocketIoService } from "../socket-io.service";
import { INewGame } from "../../../../../common/interfaces/INewGame";
import { Difficulty } from "../../../../../common/constants";
import { GameRoomManagerService } from "./GameRoomManagerService.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-multiplayer-menu",
    templateUrl: "./multiplayer-menu.component.html",
    styleUrls: ["./multiplayer-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class MultiplayerMenuComponent {
    public username: string;
    private difficulty: Difficulty;

    public constructor(private socketService: SocketIoService, public gameRooms: GameRoomManagerService,
                       private router: Router) {
        this.socketService.CreatedGameSubject.subscribe((newGame: INewGame) => {
            this.gameRooms.push(newGame);
        });

        this.socketService.DeletedGameSubject.subscribe((deletedGame: INewGame) => {
            this.gameRooms.remove(deletedGame);
        });
        this.socketService.PlayGameSubject.subscribe((gameToPlay: INewGame) => {
            if (this.gameRooms.canJoinGame(gameToPlay)) {
                this.gameRooms.setGame(gameToPlay);
                this.router.navigate(["/crossword/play"]);
            }
        });
    }

    @HostListener("window:beforeunload", ["$event"])
    public handleDestroyedComponent(): void {
        if (this.gameRooms.isDefined()) {
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
            !this.gameRooms.isDefined();
    }

    public createNewGame(): void {
        if (this.gameRooms.isUsernameUnique(this.username)) {
            this.gameRooms.createdGame = { userCreator: this.username,
                                           difficulty: this.difficulty,
                                           userCreatorID: "",
                                           userJoiner: "" };
            this.gameRooms.push(this.gameRooms.createdGame);
            this.socketService.CreatedGameSubject.next(this.gameRooms.createdGame);
        }
    }

    public deleteGame(): void {
        this.gameRooms.remove(this.gameRooms.createdGame);
        this.socketService.DeletedGameSubject.next(this.gameRooms.createdGame);
        this.gameRooms.createdGame = undefined;
    }
}
