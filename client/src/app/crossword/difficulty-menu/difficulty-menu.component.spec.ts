import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DifficultyMenuComponent } from "./difficulty-menu.component";
import { Difficulty } from "../../constants";
import { GameManager } from "../game-manager";
import { dispatchEvent } from "@angular/core/src/view/util";

describe("DifficultyMenuComponent", () => {
    let component: DifficultyMenuComponent;
    let fixture: ComponentFixture<DifficultyMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DifficultyMenuComponent]
        })
            .compileComponents();
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
        component.activateDifficulty(Difficulty.Easy);
        expect(component.isActiveDifficulty).toBe(true);
    });

    it("should have an active difficulty", () => {
        component.activateDifficulty(Difficulty.Normal);
        expect(component.isActiveDifficulty).toBe(true);
    });

    it("should have an active difficulty", () => {
        component.activateDifficulty(Difficulty.Hard);
        expect(component.isActiveDifficulty).toBe(true);
    });
});
