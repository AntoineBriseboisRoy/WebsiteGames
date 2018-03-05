import { expect } from "chai";
import { ICoordXY } from "../../../common/interfaces/ICoordXY";
import { BlackSquare } from "./BlackSquare";

describe("Verifying BlackSquares's constructor.", () => {
    it ("Should yield a BlackSquare with a correct position attribute.", () => {
        const Y_COORD: number = 6;
        const testBlackSquare: BlackSquare = new BlackSquare( {x: 0,
                                                               y: Math.abs(Math.floor(Y_COORD))} as ICoordXY);
        expect(testBlackSquare.Position.x).to.equal(0);
        expect(testBlackSquare.Position.y).to.equal(Y_COORD);
    });
});
