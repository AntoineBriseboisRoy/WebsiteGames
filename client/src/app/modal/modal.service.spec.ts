import { TestBed, inject } from "@angular/core/testing";

import { ModalService } from "./modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { ModalStateService } from "./modal-state.service";

describe("ModalService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService, NgbModal, NgbModalStack, ModalStateService]
    });
  });

  it("should be created", inject([ModalService], (service: ModalService) => {
    expect(service).toBeTruthy();
  }));
});
