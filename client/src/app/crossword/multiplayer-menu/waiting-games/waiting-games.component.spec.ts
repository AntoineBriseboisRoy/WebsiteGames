import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WaitingGamesComponent } from "./waiting-games.component";

describe("WaitingGamesComponent", () => {
  let component: WaitingGamesComponent;
  let fixture: ComponentFixture<WaitingGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
