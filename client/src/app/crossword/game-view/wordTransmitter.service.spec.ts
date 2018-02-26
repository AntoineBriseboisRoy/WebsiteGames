import { TestBed, inject } from "@angular/core/testing";

import { WordTransmitterService } from "./wordTransmitter.service";

describe("WordTransmitterService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordTransmitterService]
    });
  });

  it("should be created", inject([WordTransmitterService], (service: WordTransmitterService) => {
    expect(service).toBeTruthy();
  }));
});
