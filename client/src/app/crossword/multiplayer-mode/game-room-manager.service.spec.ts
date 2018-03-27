import { TestBed, inject } from "@angular/core/testing";

import { GameRoomManagerService } from "./game-room-manager.service";
import { SocketIoService } from "../socket-io.service";
import { GameManagerService } from "../game-manager.service";

describe("MultiplayerGameRoom", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameRoomManagerService, SocketIoService, GameManagerService]
    });
  });

  it("should be created", inject([GameRoomManagerService], (service: GameRoomManagerService) => {
    expect(service).toBeTruthy();
  }));
});
