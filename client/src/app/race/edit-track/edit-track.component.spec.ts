import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EditTrackComponent } from "./edit-track.component";

const createPoint: Function = (x: number, y: number) => {
  const oEvent: MouseEvent = document.createEvent("MouseEvent");
  oEvent.initMouseEvent("mousedown", true, true, document.defaultView, 1,
                        x, y, x, y, false, false, false, false, 1, null);
  const elem: HTMLCanvasElement = document.getElementById("edit") as HTMLCanvasElement;
  elem.dispatchEvent(oEvent);
  oEvent.initMouseEvent("mouseup", true, true, document.defaultView, 1,
                        x, y, x, y, false, false, false, false, 1, null);
  elem.dispatchEvent(oEvent);
};

describe("EditTrackComponent", () => {
  let component: EditTrackComponent;
  let fixture: ComponentFixture<EditTrackComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditTrackComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create a point", () => {
    createPoint(15, 15);
    expect(component.Points.length).toBe(1);
  });
});
