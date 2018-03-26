import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject } from "rxjs/Subject";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { GameRoomManagerService } from "./multiplayer-mode/GameRoomManagerService.service";
import { ICell } from "../../../../common/interfaces/ICell";
import { IGridWord } from "../../../../common/interfaces/IGridWord";

@Injectable()
export class SocketIoService {
    private socket: SocketIOClient.Socket;
    private createdGameSubject: Subject<INewGame>;
    private deletedGameSubject: Subject<INewGame>;
    private playGameSubject: Subject<INewGame>;

    public constructor(private gameRoomManager: GameRoomManagerService) {
        this.socket = io("http://localhost:3000/");
        this.socket.on("connect", () => {
            this.socket.emit("waiting-room");
        });
        this.createObservable<Array<INewGame>>("waiting-room").subscribe((games: Array<INewGame>) => {
            this.gameRoomManager.init(games);
        });
    }

    public init(): void {
        this.createNewGame();
        this.deleteCreatedGame();
        this.playGame();
    }

    public get CreatedGameSubject(): Subject<INewGame> {
        return this.createdGameSubject;
    }

    public get DeletedGameSubject(): Subject<INewGame> {
        return this.deletedGameSubject;
    }

    public get PlayGameSubject(): Subject<INewGame> {
        return this.playGameSubject;
    }

    public get GridContent(): Observable<Array<ICell>> {
        return this.createObservable<Array<ICell>>("grid-cells");
    }

    public get GridWords(): Observable<Array<IGridWord>> {
        return this.createObservable<Array<IGridWord>>("grid-words");
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

    private playGame(): void {
        this.playGameSubject = this.createSubject<INewGame>("play-game", "Error: Cannot play the game");
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
            error: (err: string) => {
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

            return () => this.socket.disconnect();
        });
    }
}
