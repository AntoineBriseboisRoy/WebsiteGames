import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject } from "rxjs/Subject";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { ICell } from "../../../../common/interfaces/ICell";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { IPlayer } from "../../../../common/interfaces/IPlayer";
import { IEndGame } from "../../../../common/interfaces/IEndGame";
import { IRestartGame } from "../../../../common/interfaces/IRestartGame";

@Injectable()
export class SocketIoService {
    private socket: SocketIOClient.Socket;
    private createdGameSubject: Subject<INewGame>;
    private deletedGameSubject: Subject<INewGame>;
    private restartedGameSubject: Subject<IRestartGame>;
    private playMultiplayerGameSubject: Subject<INewGame>;
    private selectedWordsSubject: Subject<Array<IGridWord>>;

    public constructor() {
        this.socket = io("http://localhost:3000/");
        this.socket.on("connect", () => {
            this.socket.emit("waiting-room");
        });
        this.init();
    }

    private init(): void {
        this.createNewGame();
        this.deleteCreatedGame();
        this.restartGame();
        this.playMultiplayerGame();
        this.selectedWords();
    }

    public get CreatedGameSubject(): Subject<INewGame> {
        return this.createdGameSubject;
    }

    public get DeletedGameSubject(): Subject<INewGame> {
        return this.deletedGameSubject;
    }

    public get RestartedGameSubject(): Subject<IRestartGame> {
        return this.restartedGameSubject;
    }

    public get PlayMultiplayerGameSubject(): Subject<INewGame> {
        return this.playMultiplayerGameSubject;
    }

    public get SelectedWordsSubject(): Subject<Array<IGridWord>> {
        return this.selectedWordsSubject;
    }

    public get GridContent(): Observable<Array<ICell>> {
        return this.createObservable<Array<ICell>>("grid-cells");
    }

    public get GridWords(): Observable<Array<IGridWord>> {
        return this.createObservable<Array<IGridWord>>("grid-words");
    }
    public get Score(): Observable<Array<IPlayer>> {
        return this.createObservable<Array<IPlayer>>("update-score");
    }
    public get WaitingRoom(): Observable<Array<INewGame>> {
        return this.createObservable<Array<INewGame>>("waiting-room");
    }
    public get DisconnectedPlayer(): Observable<void> {
        return this.createObservable<void>("disconnected-player");
    }
    public get CompletedGrid(): Observable<IEndGame> {
        return this.createObservable<IEndGame>("grid-completed");
    }
    public get StartGame(): Observer<INewGame> {
        return this.createObserver<INewGame>("start-game", "Error: Cannot start game");
    }
    public get CompletedWords(): Observer<IGridWord> {
        return this.createObserver<IGridWord>("completed-word", "Error: Cannot send completed word");
    }

    private createNewGame(): void {
        this.createdGameSubject = this.createSubject<INewGame>("new-game", "Error: Cannot send new game to other players");
    }

    private deleteCreatedGame(): void {
        this.deletedGameSubject = this.createSubject<INewGame>("delete-game", "Error: Cannot delete the game");
    }

    private restartGame(): void {
        this.restartedGameSubject = this.createSubject<IRestartGame>("restart-game", "Error: Cannot restart the game");
    }

    private playMultiplayerGame(): void {
        this.playMultiplayerGameSubject = this.createSubject<INewGame>("play-multiplayer-game", "Error: Cannot play the game");
    }
    private selectedWords(): void {
        this.selectedWordsSubject = this.createSubject<Array<IGridWord>>("selected-word", "Error: Cannot send selected word");
    }

    private createSubject<T>(emitMessage: string, errorMessage: string): Subject<T> {
        return Subject.create(this.createObserver<T>(emitMessage, errorMessage),
                              this.createObservable<T>(emitMessage));
    }

    private createObserver<T>(emitMessage: string, errorMessage: string): Observer<T> {
        return {
            next: (data: T) => {
                this.socket.emit(emitMessage, JSON.stringify(data));
            },
            error: () => {
                console.error(errorMessage);
            },
            complete: () => { this.socket.disconnect(); }
        };
    }

    private createObservable<T>(emitMessage: string): Observable<T> {
        return new Observable<T>((obs) => {
            this.socket.on(emitMessage, (data: T) => {
                obs.next(data);
            });

            return () => console.warn("observable unsubscribe");
        });
    }
}
