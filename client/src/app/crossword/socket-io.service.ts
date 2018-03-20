import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject } from "rxjs/Subject";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { MultiplayerGamesService } from "./multiplayer-menu/multiplayer-games.service";

@Injectable()
export class SocketIoService {
    private socket: SocketIOClient.Socket;
    public constructor(private multiplayerGames: MultiplayerGamesService) {
        this.socket = io("http://localhost:3000/");
        this.socket.on("connect", () =>  this.multiplayerGames.init());
    }

    public createNewGame(): Subject<INewGame> {
        const observer: Observer<INewGame> = {
            next: (data: INewGame) => {
                this.socket.emit("new-game", JSON.stringify(data));
            },
            error: (err: string) => {
                console.error("Error: Cannot send new game to other players");
            },
            complete: () => { this.socket.disconnect(); }
        };

        const observable: Observable<INewGame> = new Observable<INewGame>((obs) => {
            this.socket.on("join-game", (data: INewGame) => {
                obs.next(data);
            });

            return () => this.socket.disconnect();
        });

        return Subject.create(observer, observable);
    }

    public deleteCreatedGame(): Subject<INewGame> {
        const observer: Observer<INewGame> = {
            next: (data: INewGame) => {
                this.socket.emit("delete-game", JSON.stringify(data));
            },
            error: (err: string) => {
                console.error("Error: Cannot delete the game");
            },
            complete: () => { this.socket.disconnect(); }
        };

        const observable: Observable<INewGame> = new Observable<INewGame>((obs) => {
            this.socket.on("delete-game", (data: INewGame) => {
                obs.next(data);
            });

            return () => this.socket.disconnect();
        });

        return Subject.create(observer, observable);
    }
}
