import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TopBarComponent } from "./top-bar.component";
import { GameManagerService } from "../../game-manager.service";
import { SocketIoService } from "../../socket-io.service";

describe("TopBarComponent", () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBarComponent ],
      providers: [GameManagerService, SocketIoService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
