import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DefinitionComponent } from "./definition.component";
import { GridService } from "../../grid.service";
import { SocketIoService } from "../../socket-io.service";
import { ModalService } from "../../../modal/modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { ModalStateService } from "../../../modal/modal-state.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameManagerService } from "../../game-manager.service";

describe("DefinitionComponent", () => {
    let component: DefinitionComponent;
    let fixture: ComponentFixture<DefinitionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionComponent],
            providers: [GridService, SocketIoService, ModalService, NgbModal,
                        NgbModalStack, ModalStateService, GameManagerService],
            imports: [RouterTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
