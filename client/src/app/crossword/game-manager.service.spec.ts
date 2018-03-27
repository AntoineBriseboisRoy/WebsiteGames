import { TestBed, inject } from "@angular/core/testing";

import { GameManagerService } from "./game-manager.service";
import { SocketIoService } from "./socket-io.service";

describe("GameManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameManagerService, SocketIoService]
    });
  });

  it("should be created", inject([GameManagerService], (service: GameManagerService) => {
    expect(service).toBeTruthy();
  }));
});
