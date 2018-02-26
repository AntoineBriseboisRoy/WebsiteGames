import { TestBed, inject } from "@angular/core/testing";

import { KeyboardInputManagerService } from "./keyboard-input-manager.service";

describe("KeyboardInputManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardInputManagerService]
    });
  });

  it("should be created", inject([KeyboardInputManagerService], (service: KeyboardInputManagerService) => {
    expect(service).toBeTruthy();
  }));
});
