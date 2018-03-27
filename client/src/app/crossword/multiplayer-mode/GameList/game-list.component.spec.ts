import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameListComponent } from "./game-list.component";

describe("WaitingGamesComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListComponent ]
    })
    .compileComponents().catch((error: Error) => {
        console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
