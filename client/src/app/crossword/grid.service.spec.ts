import { TestBed, inject } from "@angular/core/testing";

import { GridService } from "./grid.service";
import { SocketIoService } from "./socket-io.service";
import { ModalService } from "../modal/modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { ModalStateService } from "../modal/modal-state.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameManagerService } from "./game-manager.service";

describe("GridService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService, SocketIoService, ModalService,
                  NgbModal, NgbModalStack, ModalStateService,
                  GameManagerService],
      imports: [RouterTestingModule]
    });
  });

  it("should be created", inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));
});
