import { expect } from "chai";
import { PosXY } from "./PosXY";

describe("Verifying PosXY's equals() function.", () => {
    it ("Should return true.", () => {
      const x: PosXY  = new PosXY(0, 0);
      const y: PosXY  = new PosXY(0, 0);
      expect(x.equals(y));
    });
});

describe("Verifying PosXY's setters with a negative number.", () => {
    it ("Should be converted to a positive coordinate.", () => {
      const x: PosXY  = new PosXY(-1, 0);
      expect(x.X).to.equal(1);
    });
});

describe("Verifying PosXY's setters with a floating point number.", () => {
    it ("Should be converted to an integer coordinate.", () => {
      const x: PosXY  = new PosXY(1.1, 0);
      expect(x.X).to.equal(1);
    });
});
