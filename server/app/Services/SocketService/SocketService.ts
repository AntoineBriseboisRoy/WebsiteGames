import * as http from "http";
import * as io from "socket.io";
import { Observable } from "rxjs/observable";
import { Observer } from "rxjs/Observer";
import { MessageHandler } from "../RoomManagerService/MessageHandler";
import { RoomManagerService } from "../RoomManagerService/RoomManagerService";
import Types from "../../types";
import { injectable, inject } from "inversify";

@injectable()
export class SocketService {
    private socketIo: SocketIO.Server;

    public constructor(@inject(Types.RoomManagerService) private roomManagerService: RoomManagerService) {
    }

    public connect(server: http.Server): void {
        this.init(server);

        this.getConnectionEvent().subscribe((socket: SocketIO.Socket) => {
            console.warn("Connected to", socket.id);
            const handler: MessageHandler = new MessageHandler(this.roomManagerService, socket, this.socketIo);
            handler.init();
        });
    }

    private init(server: http.Server): void {
        this.socketIo = io(server);
    }

    private getConnectionEvent(): Observable<SocketIO.Socket> {
        return Observable.create((observer: Observer<SocketIO.Socket>) => {
            this.socketIo.on("connection", (receivedSocket: SocketIO.Socket) => observer.next(receivedSocket));
        });
    }
}
