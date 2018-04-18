import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DifficultyMenuComponent } from "./difficulty-menu.component";
import { RouterTestingModule } from "@angular/router/testing";
import { GameManagerService } from "../game-manager.service";
import { SocketIoService } from "../socket-io.service";
import { DifficultyView } from "../../constants";

describe("DifficultyMenuComponent", () => {
    let component: DifficultyMenuComponent;
    let fixture: ComponentFixture<DifficultyMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DifficultyMenuComponent],
            providers: [GameManagerService, SocketIoService],
            imports: [RouterTestingModule]
        })
            .compileComponents().catch((error: Error) => {
                console.error(error);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultyMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have an active difficulty", () => {
        component.activateDifficulty(DifficultyView.Easy);
        expect(component.isActiveDifficulty).toBe(true);
    });

    it("should have an active difficulty", () => {
        component.activateDifficulty(DifficultyView.Medium);
        expect(component.isActiveDifficulty).toBe(true);
    });

    it("should have an active difficulty", () => {
        component.activateDifficulty(DifficultyView.Hard);
        expect(component.isActiveDifficulty).toBe(true);
    });
});
