import * as http from "http";
import * as io from "socket.io";
import { Observable } from "rxjs/observable";
import "rxjs/add/observable/fromEvent";
import { Observer } from "rxjs/Observer";
import { MessageHandler } from "../RoomManagerService/MessageHandler";
import { container } from "../../inversify.config";
import { RoomManagerService } from "../RoomManagerService/RoomManagerService";
import Types from "../../types";

export class SocketService {
    private static instance: SocketService;
    public socketIo: SocketIO.Server;
    private roomManagerService: RoomManagerService;

    public static get Instance(): SocketService {
        if (!this.instance) {
            this.instance = new SocketService();
        }

        return this.instance;
    }

    private init(server: http.Server): void {
        this.socketIo = io(server);
        this.roomManagerService = container.get<RoomManagerService>(Types.RoomManagerService);
    }
    public connect(server: http.Server): void {
        this.init(server);

        this.getConnectionEvent().subscribe((socket: SocketIO.Socket) => {
            console.warn("Connected to", socket.id);
            const handler: MessageHandler = new MessageHandler(this.roomManagerService);
            handler.init(socket);
        });
    }

    private getConnectionEvent(): Observable<SocketIO.Socket> {
        return Observable.create((observer: Observer<SocketIO.Socket>) => {
            this.socketIo.on("connection", (receivedSocket: SocketIO.Socket) => observer.next(receivedSocket));
        });
    }
}
