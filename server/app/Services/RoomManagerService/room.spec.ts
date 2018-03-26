import { Room } from "./room";
import { Player } from "../../player";
import { Difficulty } from "../../../../common/constants";
import { expect } from "chai";

const mockPlayer: Player = new Player("player1", "fakeSocketId");
const mockDifficulty: Difficulty = Difficulty.Easy;
const mockRoom: Room = new Room(mockPlayer, mockDifficulty, "mockRoom");

describe("Room", () => {

    it("should add a player", () => {
        const originalLength: number = mockRoom.Players.length;
        mockRoom.addPlayer("username", "id");
        expect(mockRoom.Players.length).greaterThan(originalLength);
    });
    it("should find the player in array of players", () => {
        expect(mockRoom.isPlayerInRoom(mockPlayer.socketID)).to.be.eql(true);
    });
    it("should not find the player in array of Players", () => {
        const inexistantId: string = "inexistantID";
        expect(mockRoom.isPlayerInRoom(inexistantId)).to.be.eql(false);
    });
});
