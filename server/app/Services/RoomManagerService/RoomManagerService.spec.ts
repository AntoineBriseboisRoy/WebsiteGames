import { Room } from "./room";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { RoomState, Difficulty } from "../../../../common/constants";
import { RoomManagerService } from "./RoomManagerService";
import * as chai from "chai";
import * as spy from "chai-spies";
import { Player } from "../../player";

const ID_NOT_FOUND: number = -1;

const mockPlayer: Player = new Player("player1", "fakeSocketId");
const mockPlayer2: Player = new Player("player2", "fakeSocketId2");
const mockDifficulty: Difficulty = Difficulty.Easy;
const mockRoom1: Room = new Room(mockPlayer, mockDifficulty, "mockRoom1");
const mockRoom2: Room = new Room(mockPlayer, mockDifficulty, "mockRoom2");

chai.use(spy);
describe("RoomManagerService", () => {
    it("should push a room in Array of Room", () => {
        const spyRooms: any = chai.spy.on(RoomManagerService.Instance, "push");
        RoomManagerService.Instance.push(mockRoom1);
        chai.expect(spyRooms).to.have.been.called.with(mockRoom1);
    });
    it("should find a room", () => {
        chai.expect(RoomManagerService.Instance.findRoom(mockPlayer.socketID)).to.be.equal(0);
    });
    it("should not find a room", () => {
        chai.expect(RoomManagerService.Instance.findRoom(mockPlayer2.socketID)).to.be.be.equal(ID_NOT_FOUND);
    });
    it("should return undefined as a room", () => {
        // tslint:disable-next-line:no-unused-expression
        chai.expect(RoomManagerService.Instance.getRoom(mockPlayer2.socketID)).to.be.undefined;
    });
    it("should return mockRoom1 as a room", () => {
        const room: Room = RoomManagerService.Instance.getRoom(mockPlayer.socketID);
        chai.expect(room).to.be.equal(mockRoom1);
    });
    it("should call the delete method", () => {
        const spy: any = chai.spy.on(RoomManagerService.Instance, "deleteRoom");
        RoomManagerService.Instance.deleteRoom(mockPlayer.socketID);
        chai.expect(spy).to.have.been.called();
    });
    it("should create an array of size 2", () => {
        let waitingGames: Array<INewGame> = new Array<INewGame>();
        RoomManagerService.Instance.push(mockRoom1);
        RoomManagerService.Instance.push(mockRoom2);
        waitingGames = RoomManagerService.Instance.getWaitingGames();
        chai.expect(waitingGames.length).to.be.equal(2);
        RoomManagerService.Instance.deleteRoom(mockPlayer.socketID);
        RoomManagerService.Instance.deleteRoom(mockPlayer2.socketID);
    });
    it("should give only the waitingGames", () => {
        let waitingGames: Array<INewGame> = new Array<INewGame>();
        RoomManagerService.Instance.push(mockRoom1);
        RoomManagerService.Instance.push(mockRoom2);
        mockRoom2.state = RoomState.Playing;
        waitingGames = RoomManagerService.Instance.getWaitingGames();
        chai.expect(waitingGames.length).to.be.equal(1);
    });
    it("should give an empty array of waitingGames", () => {
        let waitingGames: Array<INewGame> = new Array<INewGame>();
        mockRoom1.state = RoomState.Playing;
        waitingGames = RoomManagerService.Instance.getWaitingGames();
        chai.expect(waitingGames.length).to.be.equal(0);
    });
    it("should call the addPlayer method", () => {
        const spy: any = chai.spy.on(RoomManagerService.Instance, "addPlayerToRoom");
        RoomManagerService.Instance.addPlayerToRoom("aa", "bb", "");
        chai.expect(spy).to.have.been.called();
    });

});
