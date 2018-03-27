import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GridComponent } from "./grid.component";
import { GridService } from "../../grid.service";
import { SocketIoService } from "../../socket-io.service";
import { ModalService } from "../../../modal/modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { ModalStateService } from "../../../modal/modal-state.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameManagerService } from "../../game-manager.service";

describe("GridComponent", () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GridComponent],
            providers: [GridService, SocketIoService, ModalService, NgbModal,
                        NgbModalStack, ModalStateService, GameManagerService],
            imports: [RouterTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
