import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordViewComponent } from './crossword-view.component';

describe('CrosswordViewComponent', () => {
  let component: CrosswordViewComponent;
  let fixture: ComponentFixture<CrosswordViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
