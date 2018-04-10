import { TestBed, inject } from "@angular/core/testing";

import { SelectionHandlerService } from "./selection-handler.service";

describe("SelectionHandlerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionHandlerService]
    });
  });

  it("should be created", inject([SelectionHandlerService], (service: SelectionHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
