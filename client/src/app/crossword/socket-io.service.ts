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
    public constructor(private multiplayerGames: MultiplayerGamesService) { }

    public connect(): Subject<INewGame> {
        this.socket = io("http://localhost:3000/");

        this.socket.on("connect", () =>  this.multiplayerGames.init());
        // observer subscribes to an Observable. Then that observer reacts to whatever
        // item or sequence of items the Observable emits.

        // Listen to the messages our components send, and send the information to the server
        const observer: Observer<INewGame> = {
            next: (data: INewGame) => {
                this.socket.emit("new-game", JSON.stringify(data));
                console.log(data);
            },
            error: (err: string) => {
                console.error("Error: Cannot send new game to other players");
            },
            complete: () => { this.socket.disconnect(); }
        };

        // Observes the incoming messages from the server (new games)
        const observable: Observable<INewGame> = new Observable<INewGame>((obs) => {
            // ajouter à la liste de parties en attente d'un autre joueur
            this.socket.on("join-game", (data: INewGame) => {
                obs.next(data);
            });
            // ?? pas sûre

            return () => this.socket.disconnect();
        });

        return Subject.create(observer, observable);
    }
}
