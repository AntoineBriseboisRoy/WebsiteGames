import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCaseComponent } from './grid-case.component';

describe('GridCaseComponent', () => {
  let component: GridCaseComponent;
  let fixture: ComponentFixture<GridCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
