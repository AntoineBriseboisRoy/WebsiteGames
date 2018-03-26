import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiplayerMenuComponent } from "./multiplayer-menu.component";
import { SocketIoService } from "../socket-io.service";
import { GameRoomManagerService } from "./GameRoomManagerService.service";
import { Router } from "@angular/router";

describe("MultiplayerMenuComponent", () => {
    const gameRoomManager: GameRoomManagerService = new GameRoomManagerService();
    const socketIoService: SocketIoService = new SocketIoService(gameRoomManager);
    const router: Router = undefined;
    let fixture: ComponentFixture<MultiplayerMenuComponent>;
    let component: MultiplayerMenuComponent = new MultiplayerMenuComponent(socketIoService, gameRoomManager, router);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultiplayerMenuComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    it("should not have completed the form, empty string", () => {
        component.username = "";
        expect(component.hasCompletedForm()).toBe(false);
    });
    it("should not have completed the form, undefined username", () => {
        component.username = undefined;
        expect(component.hasCompletedForm()).toBe(false);
    });
    it("created game should be undefined after remove", () => {
        component.deleteGame();
        expect(component.gameRooms.createdGame).toBeUndefined();
    });
    it("the number of Games should be inferior after remove", () => {
        const initialNumberOfGames: number = component.gameRooms.Games.length;
        component.deleteGame();
        expect(component.gameRooms.Games.length).toBeLessThan(initialNumberOfGames);
    });
    it("should call every method inside createNewGame", () => {
        const spy: jasmine.Spy = spyOn(component.gameRooms, "isUsernameUnique");
        const spy2: jasmine.Spy  = spyOn(component.gameRooms, "push");
        component.createNewGame();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});
