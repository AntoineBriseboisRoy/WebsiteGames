import { TestBed, inject } from "@angular/core/testing";

import { GameRoomManagerService } from "./GameRoomManagerService.service";

describe("MultiplayerGamesService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameRoomManagerService]
    });
  });

  it("should be created", inject([GameRoomManagerService], (service: GameRoomManagerService) => {
    expect(service).toBeTruthy();
  }));
});
