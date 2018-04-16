import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { SocketIoService } from "./socket-io.service";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { ICell } from "../../../../common/interfaces/ICell";
import { Orientation, GameOutcome } from "../../../../common/constants";
import { Observer } from "rxjs/Observer";
import { ModalService } from "../modal/modal.service";
import { Router } from "@angular/router";
import { GameManagerService } from "./game-manager.service";
import { IEndGame } from "../../../../common/interfaces/IEndGame";
import { WINNER_TITLE, LOSER_TITLE, TIE_TITLE } from "../constants";
import { IRestartGame } from "../../../../common/interfaces/IRestartGame";

@Injectable()
export class GridService {
    public gridCells: Array<ICell>;
    public gridWords: Array<IGridWord>;
    public gridWordsHorizontal: Array<IGridWord>;
    public gridWordsVertical: Array<IGridWord>;
    public selectedWords: Array<IGridWord>;
    private hasReceivedRestartRequest: boolean;
    private static compareIndex(a: IGridWord, b: IGridWord): number {
        return a.cells[0].index - b.cells[0].index;
    }

    public constructor(private socketIO: SocketIoService, private modalService: ModalService,
                       private router: Router, private gameManagerService: GameManagerService) {
        this.gridCells = new Array();
        this.gridWords = new Array();
        this.gridWordsHorizontal = new Array();
        this.gridWordsVertical = new Array();
        this.selectedWords = new Array();
        this.hasReceivedRestartRequest = true;
        this.initSinglePlayerGame();
        this.socketIO.DisconnectedPlayer.subscribe(() => this.alertDisconnectedPlayer());
        this.socketIO.CompletedGrid.subscribe((endGame: IEndGame) => this.alertCompletedGrid(endGame));
    }

    private initSinglePlayerGame(): void {
        if (!this.gameManagerService.isMultiplayer) {
            this.socketIO.StartGame.next({
                userCreator: "Player One",
                difficulty: this.gameManagerService.difficulty,
                userCreatorID: "",
                userJoiner: ""
            });
        }
    }

    public fetchGrid(): Observable<void> {
        return Observable.create((obs: Observer<void>) => {
            this.socketIO.GridContent.subscribe((gridCells: Array<ICell>) => {
                this.addFoundWord(gridCells);
                this.fetchGridWords(obs);
            });
        });
    }

    private addFoundWord(gridCells: Array<ICell>): void {
        for (const serverCell of gridCells) {
            if (this.isFoundOrUndefined(serverCell)) {
                this.gridCells[serverCell.gridIndex] = serverCell;
            }
        }
    }

    private isFoundOrUndefined(serverCell: ICell): boolean {
        return serverCell.isFound || !this.gridCells[serverCell.gridIndex];
    }

    private fetchGridWords(obs: Observer<void>): void {
        this.socketIO.GridWords.subscribe((gridWords: Array<IGridWord>) => {
            this.gridWords = gridWords;
            this.setWordReferencesToCells(this.gridWords);
            this.gridWords.sort(GridService.compareIndex);
            this.splitHorizontalAndVerticalWords();
            this.fetchSelectedWords();
            obs.next(null);
        });
    }

    private fetchSelectedWords(): void {
        this.socketIO.SelectedWordsSubject.subscribe((selectedWords: Array<IGridWord>) => {
            this.selectedWords = selectedWords;
            this.setWordReferencesToCells(this.selectedWords);
        });
    }

    private setWordReferencesToCells(words: Array<IGridWord>): void {
        for (const word of words) {
            if (word) {
                for (let i: number = 0; i < word.cells.length; i++) {
                    word.cells[i] = this.gridCells[word.cells[i].gridIndex];
                }
            }
        }
    }

    private splitHorizontalAndVerticalWords(): void {
        this.gridWordsHorizontal.length = 0;
        this.gridWordsVertical.length = 0;
        this.gridWords.forEach((word: IGridWord) => {
            if (word.orientation === Orientation.Horizontal) {
                this.gridWordsHorizontal.push(word);
            } else {
                this.gridWordsVertical.push(word);
            }
        });
    }

    private alertDisconnectedPlayer(): void {
        this.modalService.open({
            title: "Sorry!", message: "The other player left the game. Would you like to play another game?",
            firstButton: "Start a new game", secondButton: "Home", showPreview: false
        })
            .then(() => this.router.navigate(["crossword"]),
                  () => this.router.navigate([""])
            );
    }

    private alertCompletedGrid(endGame: IEndGame): void {
        let message: string;
        switch ( endGame.Outcome ) {
            case GameOutcome.Win:
                message = "Your score is " + endGame.Winner.score;
                message += this.gameManagerService.isMultiplayer ? ". " + endGame.Loser.username +
                           " has a score of " + endGame.Loser.score : "";
                this.openEndGameModal(WINNER_TITLE, message);
                break;
            case GameOutcome.Lose:
                message = "Your score is " + endGame.Loser.score + ". " +
                          endGame.Winner.username + " has a score of " + endGame.Winner.score;
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
        this.modalService.open({
            title: title, message: message + "! You can choose to replay or go back to home page",
            firstButton: "Restart Game", secondButton: "Home", showPreview: false
        })
            .then(() => this.restartGame(),
                  () => this.router.navigate([""])
            );
        this.socketIO.RestartedGameSubject.subscribe((game: IRestartGame) => {
            this.hasReceivedRestartRequest = false;
            this.modalService.close();
        });
    }

    private restartGame(): void {
        if (this.gameManagerService.isMultiplayer && this.hasReceivedRestartRequest) {
            this.socketIO.RestartedGameSubject.next({ requestSent: true });
            this.gridWords.length = 0;
            this.gridCells.length = 0;
            this.router.navigate(["crossword/waiting"]);
        } else if (this.gameManagerService.isMultiplayer && !this.hasReceivedRestartRequest) {
            this.restartGameModal();
        } else {
            this.socketIO.RestartedGameSubject.next({ requestSent: false, requestAccepted: true });
        }
    }

    private restartGameModal(): void {
        this.modalService.open({
            title: "Your opponent would like to play again", message: "Do you want to play with the same configuration?",
            firstButton: "Yes", secondButton: "No", showPreview: false
        })
            .then(() => {
                this.socketIO.RestartedGameSubject.next({ requestSent: false, requestAccepted: true });
                this.gridWords.length = 0;
                this.gridCells.length = 0;
                this.socketIO.RestartedGameSubject.subscribe((restartGame: IRestartGame) => {
                    if (restartGame.requestAccepted) {
                        this.router.navigate(["crossword/play"]);
                    } else {
                        this.openRefusedRestartGameModal();
                    }
                });
            },
                  () => {
                this.socketIO.RestartedGameSubject.next({ requestSent: false, requestAccepted: false });
                this.router.navigate([""]);
            });
    }

    private openRefusedRestartGameModal(): void {
        this.modalService.open({
            title: "Your opponent doesn't want to play again",
            message: "You can play another crossword game or try our fabulous race game.",
            firstButton: "Home", secondButton: "Start a solo game ", showPreview: false
        })
            .then(() => this.router.navigate([""]),
                  () => this.router.navigate(["crossword/play"])
            );
    }
}
