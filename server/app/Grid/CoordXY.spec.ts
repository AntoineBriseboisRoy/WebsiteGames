import { expect } from "chai";
import { CoordXY } from "./CoordXY";

describe("Verifying PosXY's equals() function.", () => {
    it ("Should return true.", () => {
      const x: CoordXY  = new CoordXY(0, 0);
      const y: CoordXY  = new CoordXY(0, 0);
      expect(x.equals(y));
    });
});

describe("Verifying CoordXY's setters with a negative number.", () => {
    it ("Should be converted to a positive coordinate.", () => {
      const x: CoordXY  = new CoordXY(-1, 0);
      expect(x.X).to.equal(1);
    });
});

describe("Verifying PosXY's setters with a floating point number.", () => {
    it ("Should be converted to an integer coordinate.", () => {
      const x: CoordXY  = new CoordXY(1.1, 0);
      expect(x.X).to.equal(1);
    });
});
