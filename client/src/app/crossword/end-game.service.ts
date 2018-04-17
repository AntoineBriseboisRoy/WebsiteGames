import { Injectable } from "@angular/core";
import { SocketIoService } from "./socket-io.service";
import { ModalService } from "../modal/modal.service";
import { Router } from "@angular/router";
import { GameManagerService } from "./game-manager.service";
import { IEndGame } from "../../../../common/interfaces/IEndGame";
import { GameOutcome } from "../../../../common/constants";
import { WINNER_TITLE, LOSER_TITLE, TIE_TITLE } from "../constants";
import { IRestartGame } from "../../../../common/interfaces/IRestartGame";
import { GridService } from "./grid.service";

@Injectable()
export class EndGameService {
    private hasReceivedRestartRequest: boolean;

    private static capitalizeFirstLetter(username: string): string {
        return username[0].toUpperCase() + username.slice(1);
    }

    public constructor(private socketIO: SocketIoService, private modalService: ModalService, private gridService: GridService,
                       private router: Router, private gameManagerService: GameManagerService) {
        this.hasReceivedRestartRequest = false;
    }

    public initSubscriptions(): void {
        this.socketIO.RestartedGameSubject.unsubscribe();
        this.socketIO.DisconnectedPlayer.subscribe(() => this.alertDisconnectedPlayer());
        this.socketIO.CompletedGrid.subscribe((endGame: IEndGame) => this.alertCompletedGrid(endGame));
    }
    private alertDisconnectedPlayer(): void {
        if (this.modalService.IsOpen) {
            this.modalService.closeWithSecondButton();
        } else {
            this.modalService.open({
                title: "Sorry!", message: "The other player left the game. Would you like to play another game?",
                firstButton: "Start a new game", secondButton: "Home", showPreview: false
            })
                .then(() => this.router.navigate(["crossword"]),
                      () => this.router.navigate([""])
                );
        }
    }

    private alertCompletedGrid(endGame: IEndGame): void {
        let message: string;
        switch ( endGame.Outcome ) {
            case GameOutcome.Win:
                message = "Your score is " + endGame.Winner.score;
                message += this.gameManagerService.isMultiplayer ? ". " +
                           EndGameService.capitalizeFirstLetter(endGame.Loser.username) +
                           " has a score of " + endGame.Loser.score : "";
                this.openEndGameModal(WINNER_TITLE, message);
                break;
            case GameOutcome.Lose:
                message = "Your score is " + endGame.Loser.score + ". " +
                          EndGameService.capitalizeFirstLetter(endGame.Winner.username) +
                          " has a score of " + endGame.Winner.score;
                this.openEndGameModal(LOSER_TITLE, message);
                break;
            case GameOutcome.Tie:
                message = "You both have a score of " + this.gameManagerService.players[0].score;
                this.openEndGameModal(TIE_TITLE, message);
                break;
            default:
                break;
        }
    }

    private openEndGameModal(title: string, message: string): void {
        if (!this.modalService.IsOpen) {
            this.modalService.open({
                title: title, message: message + "! You can choose to replay or go back to home page",
                firstButton: "Restart Game", secondButton: "Home", showPreview: false
            })
                .then(() => this.restartGame(),
                      () => {
                                this.socketIO.RestartedGameSubject.complete();
                                this.router.navigate([""]);
                            }
                );
            this.subscribeToRestartRequest();
        }
    }

    private restartGame(): void {
        if (this.gameManagerService.isMultiplayer && !this.hasReceivedRestartRequest) {
            this.sendRestartRequestMultiplayer();
        } else if (this.gameManagerService.isMultiplayer && this.hasReceivedRestartRequest) {
            this.restartGameModal();
            this.hasReceivedRestartRequest = false;
        } else {
            this.gridService.resetGrid();
            this.sendRestartGame();
        }
    }

    private sendRestartRequestMultiplayer(): void {
        this.socketIO.RestartedGameSubject.next({ requestSent: true });
        this.gridService.resetGrid();
        this.router.navigate(["crossword/waiting"]);
    }

    private subscribeToRestartRequest(): void {
        this.socketIO.RestartedGameSubject.subscribe((game: IRestartGame) => {
            if (game.requestSent) {
                this.hasReceivedRestartRequest = true;
                this.modalService.closeWithFirstButton();
            }
        });
    }

    private sendRestartGame(): void {
        this.socketIO.RestartedGameSubject.next({ requestSent: false, requestAccepted: true });
    }

    private restartGameModal(): void {
        this.modalService.open({
            title: "Your opponent would like to play again", message: "Do you want to play with the same configuration?",
            firstButton: "Yes", secondButton: "No", showPreview: false
        })
            .then(() => this.restartGameMultiplayer(),
                  () => this.refuseRestartGameMultiplayer()
            );
    }

    private restartGameMultiplayer(): void {
        this.sendRestartGame();
        this.gridService.resetGrid();
        this.subscribeToRestartRequestResponse();
    }

    public subscribeToRestartRequestResponse(): void {
        this.socketIO.RestartedGameSubject.subscribe((restartGame: IRestartGame) => {
            if (restartGame.requestAccepted) {
                this.router.navigate(["crossword/play"]);
            } else {
                this.openRefusedRestartGameModal();
            }
        });
    }

    private refuseRestartGameMultiplayer(): void {
        this.socketIO.RestartedGameSubject.next({ requestSent: false, requestAccepted: false });
        this.router.navigate([""]);
    }

    private openRefusedRestartGameModal(): void {
        this.modalService.open({
            title: "Your opponent doesn't want to play again",
            message: "You can play another crossword game or try our fabulous race game.",
            firstButton: "Start a solo game", secondButton: "Home", showPreview: false
        })
            .then(() => this.router.navigate(["crossword/difficulty"]),
                  () => this.router.navigate([""])
            );
    }
}
