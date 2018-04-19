import { Room } from "./room";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { RoomState, Difficulty } from "../../../../common/constants";
import { RoomManagerService } from "./RoomManagerService";
import * as chai from "chai";
import * as spy from "chai-spies";
import { Player } from "../../player";
import { container } from "../../inversify.config";
import Types from "../../types";

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
