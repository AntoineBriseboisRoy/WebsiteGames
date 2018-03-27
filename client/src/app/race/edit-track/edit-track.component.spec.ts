/* tslint:disable:no-magic-numbers */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EditTrackComponent } from "./edit-track.component";
import * as cst from "../../constants";

let elem: HTMLCanvasElement;
const oEvent: MouseEvent = document.createEvent("MouseEvent");

const createMouseEvent: Function = (nameEvent: string, x: number, y: number, button: number) => {
    oEvent.initMouseEvent(nameEvent, true, true, document.defaultView, 1,
                          x, y, x, y, false, false, false, false, button, null);
    elem.dispatchEvent(oEvent);
};

const createPoint: Function = (x: number, y: number) => {
    createMouseEvent("mousedown", x, y, 0);
    createMouseEvent("mouseup", x, y, 0);
};

describe("EditTrackComponent", () => {
    let component: EditTrackComponent;
    let fixture: ComponentFixture<EditTrackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditTrackComponent]
        })
            .compileComponents().catch((error: Error) => {
                console.error(error);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditTrackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        elem = document.getElementById("edit") as HTMLCanvasElement;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should create a point", () => {
        createPoint(15, 15);
        expect(component.Points.length).toBe(1);
    });

    it("should identify the first point as the start point", () => {
        createPoint(15, 15);
        expect(component.Points[0].start).toBeTruthy();
        expect(component.Points[0].end).toBeFalsy();
    });

    it("should close the track if a point is placed on the first point", () => {
        createPoint(15, 15);
        createPoint(15, 45);
        createPoint(5, 85);
        createPoint(15, 15);
        expect(component.Points.length).toBe(4);
        expect(component.Points[component.Points.length - 1].start).toBeFalsy();
        expect(component.Points[component.Points.length - 1].end).toBeTruthy();
    });

    it("should not add point if track is complete", () => {
        createPoint(15, 15);
        createPoint(15, 45);
        createPoint(5, 85);
        createPoint(15, 15);
        createPoint(100, 100);
        expect(component.Points.length).toBe(4);
        expect(component.Points[component.Points.length - 1].x).toBe(15);
        expect(component.Points[component.Points.length - 1].y).toBe(15);
    });

    it("should move point if it's being dragged", () => {
        createPoint(15, 15);
        createPoint(15, 45);
        createPoint(5, 85);
        createMouseEvent("mousedown", 15, 45, 0);
        createMouseEvent("mousemove", 140, 25, 0);
        expect(component.Points[component.Points.length - 2].x).toBe(140);
        expect(component.Points[component.Points.length - 2].y).toBe(25);
    });

    it("should delete last point if right click", () => {
        createPoint(15, 15);
        createPoint(15, 45);
        createPoint(5, 85);
        createPoint(15, 15);
        createMouseEvent("mousedown", 15, 45, cst.RIGHT_MOUSE_BUTTON);
        createMouseEvent("mouseup", 15, 45, cst.RIGHT_MOUSE_BUTTON);
        expect(component.Points.length).toBe(3);
    });
});
