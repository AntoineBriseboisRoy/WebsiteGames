import { TestBed, inject } from "@angular/core/testing";

import { GameRoomManagerService } from "./game-room-manager.service";
import { SocketIoService } from "../socket-io.service";
import { GameManagerService } from "../game-manager.service";
import { INewGame } from "../../../../../common/interfaces/INewGame";
import { Difficulty } from "../../../../../common/constants";

describe("MultiplayerGameRoom", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameRoomManagerService, SocketIoService, GameManagerService]
        });
    });

    it("should be created", inject([GameRoomManagerService], (service: GameRoomManagerService) => {
        expect(service).toBeTruthy();
    }));

    it("should be able to create a game", (inject([GameRoomManagerService, SocketIoService, GameManagerService],
                                                  (gameRoomManagerService: GameRoomManagerService,
                                                   gameManagerService: GameManagerService,
                                                   socketService: SocketIoService)  => {
        socketService = new SocketIoService();
        const newGame: INewGame = { userCreator: "p1", difficulty: Difficulty.Easy, userCreatorID: "", userJoiner: "" };
        gameRoomManagerService = new GameRoomManagerService(gameManagerService, socketService);
        expect(gameRoomManagerService.Games.length).toBe(0);
        socketService.CreatedGameSubject.next(newGame);
        socketService.CreatedGameSubject.subscribe((game: INewGame) => {
            expect(gameRoomManagerService.Games.length).toBe(1);
            expect(game.userCreator).toBe(newGame.userCreator);
            expect(game.difficulty).toBe(newGame.difficulty);
            socketService.DeletedGameSubject.next(game);
        });

    })));

    it("should be able to join a waiting game", (inject([GameRoomManagerService, SocketIoService, GameManagerService],
                                                        (gameRoomManagerService: GameRoomManagerService,
                                                         gameManagerService: GameManagerService,
                                                         socketService: SocketIoService) => {
        socketService = new SocketIoService();
        const newGame: INewGame = { userCreator: "p1", difficulty: Difficulty.Easy, userCreatorID: "", userJoiner: "" };
        gameRoomManagerService = new GameRoomManagerService(gameManagerService, socketService);
        socketService.CreatedGameSubject.next(newGame);
        expect(gameRoomManagerService.Games.length).toBe(0);
        socketService.CreatedGameSubject.subscribe(() => {
            expect(gameRoomManagerService.Games.length).toBe(1);
            const joinGame: INewGame = { userCreator: newGame.userCreator,
                                         difficulty: newGame.difficulty,
                                         userCreatorID: gameRoomManagerService.Games[0].userCreatorID,
                                         userJoiner: "p2" };
            socketService.PlayMultiplayerGameSubject.next(joinGame);
            socketService.PlayMultiplayerGameSubject.subscribe((game: INewGame) => {
                expect(gameRoomManagerService.Games[0].userJoiner).toBe(joinGame.userJoiner);
                // tslint:disable-next-line:no-magic-numbers
                expect(gameManagerService.players.length).toBe(2);
                expect(gameManagerService.players[1].username).toBe(joinGame.userJoiner);
                socketService.PlayMultiplayerGameSubject.complete();
            });
        });
    })));

    it("should be able to play when joining a waiting game", (inject([GameRoomManagerService, SocketIoService, GameManagerService],
                                                                     (gameRoomManagerService: GameRoomManagerService,
                                                                      gameManagerService: GameManagerService,
                                                                      socketService: SocketIoService) => {
        socketService = new SocketIoService();
        const windowLocation: string = window.location.href;
        const newGame: INewGame = { userCreator: "p1", difficulty: Difficulty.Easy, userCreatorID: "", userJoiner: "" };
        gameRoomManagerService = new GameRoomManagerService(gameManagerService, socketService);
        socketService.CreatedGameSubject.next(newGame);
        socketService.CreatedGameSubject.subscribe(() => {
            const joinGame: INewGame = {
                userCreator: newGame.userCreator,
                difficulty: newGame.difficulty,
                userCreatorID: gameRoomManagerService.Games[0].userCreatorID,
                userJoiner: "p2"
            };
            socketService.PlayMultiplayerGameSubject.next(joinGame);
            socketService.PlayMultiplayerGameSubject.subscribe((game: INewGame) => {
                expect(windowLocation !== window.location.href).toBe(true);
                expect(window.location.href).toBe("http://localhost:4200/crossword/play");
            });
        });
    })));

});
