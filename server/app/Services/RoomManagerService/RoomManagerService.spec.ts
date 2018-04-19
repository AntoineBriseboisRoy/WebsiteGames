import { Room } from "./room";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { RoomState, Difficulty } from "../../../../common/constants";
import { RoomManagerService } from "./RoomManagerService";
import * as chai from "chai";
import * as spy from "chai-spies";
import { Player } from "../../player";
import { container } from "../../inversify.config";
import Types from "../../types";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { ICell, Finder } from "../../../../common/interfaces/ICell";

const ID_NOT_FOUND: number = -1;

const mockPlayer: Player = new Player("player1", "fakeSocketId");
const mockPlayer2: Player = new Player("player2", "fakeSocketId2");
const mockDifficulty: Difficulty = Difficulty.Easy;
const mockRoom1: Room = new Room(mockPlayer, mockDifficulty, "mockRoom1");
const mockRoom2: Room = new Room(mockPlayer, mockDifficulty, "mockRoom2");
const roomManagerService: RoomManagerService = container.get<RoomManagerService>(Types.RoomManagerService);
// tslint:disable:no-any
chai.use(spy);
describe("RoomManagerService", () => {
    it("should return the same grid for the players in the same room", () => {
        const game: INewGame = { userCreator: "p1", difficulty: Difficulty.Easy, userCreatorID: "abc", userJoiner: ""};
        roomManagerService.createNewRoom(game).then(() => {
            roomManagerService.addPlayerToRoom("p2", "defg", "abc");
            const gridWordsP1: Array<IGridWord> = roomManagerService.getRoom("abc").Words;
            const gridWordsP2: Array<IGridWord> = roomManagerService.getRoom("defg").Words;
            chai.expect(gridWordsP1).to.be.equal(gridWordsP2);
        }).catch();
    });
    it("should return to player 2 the word found by player 1", () => {
        const game2: INewGame = { userCreator: "p3", difficulty: Difficulty.Easy, userCreatorID: "hijk", userJoiner: ""};
        roomManagerService.createNewRoom(game2).then(() => {
            roomManagerService.addPlayerToRoom("p4", "lmnop", "hijk");
            const gridWordsP1: Array<IGridWord> = roomManagerService.getRoom("hijk").Words;
            gridWordsP1[0].isFound = true;
            gridWordsP1[0].cells.forEach((cell: ICell) => {
                cell.isFound = true;
                cell.finder = Finder.player1;
            });
            roomManagerService.getRoom("hijk").setWordFound(gridWordsP1[0], "hijk");
            chai.expect(roomManagerService.getRoom("lmnop").Words[0].isFound).to.be.equal(true);
        }).catch();
    });
    it("should be able to see who found the word", () => {
        const game3: INewGame = { userCreator: "p3", difficulty: Difficulty.Easy, userCreatorID: "hijk", userJoiner: ""};
        roomManagerService.createNewRoom(game3).then(() => {
            roomManagerService.addPlayerToRoom("p4", "lmnop", "hijk");
            const gridWordsP1: Array<IGridWord> = roomManagerService.getRoom("hijk").Words;
            gridWordsP1[0].isFound = true;
            gridWordsP1[0].cells.forEach((cell: ICell) => {
                cell.isFound = true;
                cell.finder = Finder.player1;
            });
            roomManagerService.getRoom("hijk").setWordFound(gridWordsP1[0], "hijk");
            chai.expect(roomManagerService.getRoom("lmnop").Words[0].cells[0].finder).to.be.equal(Finder.player1);
        }).catch();
    });
    it("should return to player 2 the word selected by player 1", () => {
        const game3: INewGame = { userCreator: "p7", difficulty: Difficulty.Easy, userCreatorID: "123", userJoiner: ""};
        roomManagerService.createNewRoom(game3).then(() => {
            roomManagerService.addPlayerToRoom("p8", "456", "123");
            const gridWordsP1: Array<IGridWord> = roomManagerService.getRoom("123").Words;
            roomManagerService.getRoom("123").selectWord(gridWordsP1[0], "123");
            chai.expect(roomManagerService.getRoom("456").Players[0].selectedWord).to.be.equal(gridWordsP1[0]);
            chai.expect(roomManagerService.getRoom("456").Players[1].selectedWord).to.be.equal(undefined);
        }).catch();
    });
    it("should push a room in Array of Room", () => {
        const spyRooms: any = chai.spy.on(RoomManagerService, "push");
        roomManagerService.push(mockRoom1);
        chai.expect(spyRooms).to.have.been.called.with(mockRoom1);
    });
    it("should find a room", () => {
        chai.expect(roomManagerService.findRoom(mockPlayer.socketID)).to.be.equal(0);
    });
    it("should not find a room", () => {
        chai.expect(roomManagerService.findRoom(mockPlayer2.socketID)).to.be.be.equal(ID_NOT_FOUND);
    });
    it("should return undefined as a room", () => {
        // tslint:disable-next-line:no-unused-expression
        chai.expect(roomManagerService.getRoom(mockPlayer2.socketID)).to.be.undefined;
    });
    it("should return mockRoom1 as a room", () => {
        const room: Room = roomManagerService.getRoom(mockPlayer.socketID);
        chai.expect(room).to.be.equal(mockRoom1);
    });
    it("should call the delete method", () => {
        const spy1: any = chai.spy.on(roomManagerService, "deleteRoom");
        roomManagerService.deleteRoom(mockPlayer.socketID);
        chai.expect(spy1).to.have.been.called();
    });
    it("should create an array of size 2", () => {
        let waitingGames: Array<INewGame> = new Array<INewGame>();
        roomManagerService.push(mockRoom1);
        roomManagerService.push(mockRoom2);
        waitingGames = roomManagerService.getWaitingGames();
        // tslint:disable-next-line:no-magic-numbers
        chai.expect(waitingGames.length).to.be.equal(2);
        roomManagerService.deleteRoom(mockPlayer.socketID);
        roomManagerService.deleteRoom(mockPlayer2.socketID);
    });
    it("should give only the waitingGames", () => {
        let waitingGames: Array<INewGame> = new Array<INewGame>();
        roomManagerService.push(mockRoom1);
        roomManagerService.push(mockRoom2);
        mockRoom2.state = RoomState.Playing;
        waitingGames = roomManagerService.getWaitingGames();
        chai.expect(waitingGames.length).to.be.equal(1);
    });
    it("should give an empty array of waitingGames", () => {
        let waitingGames: Array<INewGame> = new Array<INewGame>();
        mockRoom1.state = RoomState.Playing;
        waitingGames = roomManagerService.getWaitingGames();
        chai.expect(waitingGames.length).to.be.equal(0);
    });
    it("should call the addPlayer method", () => {
        const spy2: any = chai.spy.on(roomManagerService, "addPlayerToRoom");
        roomManagerService.addPlayerToRoom("aa", "bb", "");
        chai.expect(spy2).to.have.been.called();
    });

});
