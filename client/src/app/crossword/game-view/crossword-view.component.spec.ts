import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {TopBarComponent} from "./top-bar/top-bar.component";
import {GridComponent} from "./grid/grid.component";
import {DefinitionComponent} from "./definition/definition.component";
import { CrosswordViewComponent } from "./crossword-view.component";

describe("CrosswordViewComponent", () => {
  let component: CrosswordViewComponent;
  let fixture: ComponentFixture<CrosswordViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordViewComponent, TopBarComponent, GridComponent, DefinitionComponent ]
    })
    .compileComponents().catch((error: Error) => {
        console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
