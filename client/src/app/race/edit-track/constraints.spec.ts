/* tslint:disable:no-magic-numbers */
import { Constraints } from "./constraints";
import { Point } from "./Geometry";
import * as cst from "../../constants";

describe("constraints", () => {
    const constraints: Constraints = new Constraints();

    it("should create", () => {
        expect(constraints).toBeTruthy();
    });

    it("should check if angle is over 45 degree", () => {
        const array: Point[] = [{ x: 0, y: 0, start: true, end: false },
                                { x: 900, y: 0, start: false, end: false },
                                { x: 900, y: 900, start: false, end: false },
                                { x: 0, y: 900, start: false, end: false },
                                { x: 0, y: 0, start: false, end: true }];
        constraints.checkConstraints(array, true, new ClientRect());
        for (const seg of constraints.Segments) {
            expect(seg.broken).toBeFalsy();
        }
    });

    it("should check if angle is less than 45 degree", () => {
        const array: Point[] = [{ x: 0, y: 0, start: true, end: false },
                                { x: 900, y: 0, start: false, end: false },
                                { x: 0, y: 899, start: false, end: false }];
        constraints.checkConstraints(array, false, new ClientRect());
        for (const seg of constraints.Segments) {
            expect(seg.broken).toBeTruthy();
        }
    });

    it("should check if segments are overlaping", () => {
        const array: Point[] = [{ x: 0, y: 0, start: true, end: false },
                                { x: 900, y: 0, start: false, end: false },
                                { x: 900, y: 900, start: false, end: false },
                                { x: 450, y: -900, start: false, end: false }];
        constraints.checkConstraints(array, false, new ClientRect());
        expect(constraints.Segments[constraints.Segments.length - 1].broken).toBeTruthy();
        expect(constraints.Segments[0].broken).toBeTruthy();
    });

    it("should check if perpendicular segments are overlaping", () => {
        const array: Point[] = [{ x: 0, y: 0, start: true, end: false },
                                { x: 900, y: 0, start: false, end: false },
                                { x: 900, y: 900, start: false, end: false },
                                { x: 450, y: 900, start: false, end: false },
                                { x: 450, y: -900, start: false, end: false }];
        constraints.checkConstraints(array, false, new ClientRect());
        expect(constraints.Segments[constraints.Segments.length - 1].broken).toBeTruthy();
        expect(constraints.Segments[0].broken).toBeTruthy();
    });

    it("should check if segments are not too short", () => {
        const array: Point[] = [{ x: 0, y: 0, start: true, end: false },
                                { x: cst.MINIMUM_TRACK_LENGTH - 1, y: 0, start: true, end: false },
                                { x: cst.MINIMUM_TRACK_LENGTH - 1, y: cst.MINIMUM_TRACK_LENGTH * 10, start: true, end: false }];
        constraints.checkConstraints(array, false, new ClientRect());
        expect(constraints.Segments[0].broken).toBeTruthy();
        expect(constraints.Segments[1].broken).toBeFalsy();
    });
});
