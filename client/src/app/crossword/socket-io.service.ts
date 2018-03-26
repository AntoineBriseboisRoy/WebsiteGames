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
        this.init();
        this.createObservable<Array<INewGame>>("waiting-room", "Error: Cannot receive games").subscribe((games: Array<INewGame>) => {
            this.gameRoomManager.init(games);
        });
    }

    private init(): void {
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
        return new Observable<Array<ICell>>((obs) => {
            this.socket.on("grid-cells", (data: Array<ICell>) => {
                obs.next(data);
            });

            return () => this.socket.disconnect();
        });
    }

    public get GridWords(): Observable<Array<IGridWord>> {
        return new Observable<Array<IGridWord>>((obs) => {
            this.socket.on("grid-words", (data: Array<IGridWord>) => {
                obs.next(data);
            });

            return () => this.socket.disconnect();
        });
    }

    private createNewGame(): void {
        this.createdGameSubject = this.createSubject("new-game", "Error: Cannot send new game to other players");
    }

    private deleteCreatedGame(): void {
        this.deletedGameSubject = this.createSubject("delete-game", "Error: Cannot delete the game");
    }

    private playGame(): void {
        this.playGameSubject = this.createSubject("play-game", "Error: Cannot play the game");
    }

    private createSubject(emitMessage: string, errorMessage: string): Subject<INewGame> {
        return Subject.create(this.createObserver<INewGame>(emitMessage, errorMessage),
                              this.createObservable<INewGame>(emitMessage, errorMessage));
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

    private createObservable<T>(emitMessage: string, errorMessage: string): Observable<T> {
        return new Observable<T>((obs) => {
            this.socket.on(emitMessage, (data: T) => {
                obs.next(data);
            });

            return () => this.socket.disconnect();
        });
    }
}
