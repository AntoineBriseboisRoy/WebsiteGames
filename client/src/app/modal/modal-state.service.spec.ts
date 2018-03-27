import { TestBed, inject } from "@angular/core/testing";

import { ModalStateService } from "./modal-state.service";

describe("ModalStateService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalStateService]
    });
  });

  it("should be created", inject([ModalStateService], (service: ModalStateService) => {
    expect(service).toBeTruthy();
  }));
});
