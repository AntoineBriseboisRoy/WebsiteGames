import { expect } from "chai";
import { Word, Orientation } from "./Word";
import { PosXY } from "./PosXY";

describe("Verifying Word's constructor.", () => {
    it ("Construction should yield a word with the provided attributes.", () => {
      const testWord: Word = new Word(new PosXY(0, 0), Orientation.Horizontal, "Hello");
      expect(testWord.Position.X === 0 && testWord.Position.Y === 0 && testWord.Orientation === Orientation.Horizontal &&
             testWord.Content === "Hello");
    });
});

describe("Verifying if a Word's Length property matches its content's actual length.", () => {
    it ("Both lengths should be 5.", () => {
      const testWord: Word = new Word(new PosXY(0, 0), Orientation.Horizontal, "Hello");
      expect(testWord.Length).to.equal(5);
    });
});