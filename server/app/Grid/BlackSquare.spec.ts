import { expect } from "chai";
import { PosXY } from "./PosXY";
import { BlackSquare } from "./BlackSquare";

describe("Verifying BlackSquares's constructor.", () => {
    it ("Should yield a BlackSquare with a correct position attribute.", () => {
        const testBlackSquare: BlackSquare = new BlackSquare(new PosXY(0, 6));
        expect(testBlackSquare.Position.X).to.equal(0);
        expect(testBlackSquare.Position.Y).to.equal(6);
    });
});
