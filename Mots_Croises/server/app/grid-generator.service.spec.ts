import { TestBed, inject } from "../../client/node_modules/@angular/core/testing";

import { GridGeneratorService } from "./grid-generator.service";

describe("GridGeneratorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridGeneratorService]
    });
  });

  it("should be created", inject([GridGeneratorService], (service: GridGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
