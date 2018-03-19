import { TestBed, inject } from "@angular/core/testing";

import { MultiplayerGamesService } from "./multiplayer-games.service";

describe("MultiplayerGamesService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiplayerGamesService]
    });
  });

  it("should be created", inject([MultiplayerGamesService], (service: MultiplayerGamesService) => {
    expect(service).toBeTruthy();
  }));
});
