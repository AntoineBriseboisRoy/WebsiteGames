import { TestBed, inject } from "@angular/core/testing";

import { WaitingGamesService } from "./waiting-games.service";

describe("WaitingGamesService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WaitingGamesService]
    });
  });

  it("should be created", inject([WaitingGamesService], (service: WaitingGamesService) => {
    expect(service).toBeTruthy();
  }));
});
