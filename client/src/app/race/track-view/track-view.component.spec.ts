import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TrackViewComponent } from "./track-view.component";
import { UrlSegment } from "@angular/router/src/url_tree";

fdescribe("TrackViewComponent", () => {
  let component: TrackViewComponent;
  let fixture: ComponentFixture<TrackViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show a preview when track is selected", (done: DoneFn) => {
    component.callModal();
    component["route"].url.subscribe((resultUrl: UrlSegment[]) => {
      expect(resultUrl[0].path).toEqual("/race?name=Test");
    });
    done();
  });
});
