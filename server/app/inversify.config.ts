import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";
import { RoomManagerService } from "./Services/RoomManagerService/RoomManagerService";
import { MessageHandler } from "./Services/RoomManagerService/MessageHandler";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Index).to(Index);
container.bind(Types.RoomManagerService).to(RoomManagerService);
container.bind(Types.MessageHandler).to(MessageHandler);

export { container };
