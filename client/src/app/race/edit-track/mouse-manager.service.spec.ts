import { TestBed, inject } from "@angular/core/testing";

import { MouseManagerService } from "./mouse-manager.service";

describe("MouseManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MouseManagerService]
    });
  });

  it("should be created", inject([MouseManagerService], (service: MouseManagerService) => {
    expect(service).toBeTruthy();
  }));
});
