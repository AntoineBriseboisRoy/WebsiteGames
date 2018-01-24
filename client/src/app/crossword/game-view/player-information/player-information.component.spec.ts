import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInformationComponent } from './player-information.component';

describe('PlayerInformationComponent', () => {
  let component: PlayerInformationComponent;
  let fixture: ComponentFixture<PlayerInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
