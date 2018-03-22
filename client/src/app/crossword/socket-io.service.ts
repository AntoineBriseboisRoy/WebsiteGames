import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject } from "rxjs/Subject";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { GameRoomManagerService } from "./multiplayer-mode/GameRoomManagerService.service";

@Injectable()
export class SocketIoService {
    private socket: SocketIOClient.Socket;
    private createdGameSubject: Subject<INewGame>;
    private deletedGameSubject: Subject<INewGame>;
    private playGameSubject: Subject<INewGame>;

    public constructor(private gameRoomManager: GameRoomManagerService) {
        this.socket = io("http://localhost:3000/");
        this.socket.on("connect", () => {
            this.gameRoomManager.init();
            this.socket.emit("waiting-room");
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

    private createNewGame(): void {
        this.createdGameSubject =  this.createSubject("new-game", "Error: Cannot send new game to other players");
    }

    private deleteCreatedGame(): void {
        this.deletedGameSubject = this.createSubject("delete-game", "Error: Cannot delete the game");
    }

    private playGame(): void {
        this.playGameSubject = this.createSubject("play-game", "Error: Cannot play the game");
    }

    private createSubject(emitMessage: string, errorMessage: string): Subject<INewGame> {
        const observer: Observer<INewGame> = {
            next: (data: INewGame) => {
                this.socket.emit(emitMessage, JSON.stringify(data));
            },
            error: (err: string) => {
                console.error(errorMessage);
            },
            complete: () => { this.socket.disconnect(); }
        };

        const observable: Observable<INewGame> = new Observable<INewGame>((obs) => {
            this.socket.on(emitMessage, (data: INewGame) => {
                obs.next(data);
            });

            return () => this.socket.disconnect();
        });

        return Subject.create(observer, observable);
    }
}
