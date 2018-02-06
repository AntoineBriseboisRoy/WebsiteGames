import { expect } from "chai";
import { CoordXY } from "./CoordXY";
import { BlackSquare } from "./BlackSquare";

describe("Verifying BlackSquares's constructor.", () => {
    it ("Should yield a BlackSquare with a correct position attribute.", () => {
        const testBlackSquare: BlackSquare = new BlackSquare(new CoordXY(0, 6));
        const Y_COORD: number = 6;
        expect(testBlackSquare.Position.X).to.equal(0);
        expect(testBlackSquare.Position.Y).to.equal(Y_COORD);
    });
});
