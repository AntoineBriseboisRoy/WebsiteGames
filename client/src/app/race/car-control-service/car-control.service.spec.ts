import { TestBed, inject } from '@angular/core/testing';

import { CarControlService } from './car-control.service';

describe('CarControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarControlService]
    });
  });

  it('should be created', inject([CarControlService], (service: CarControlService) => {
    expect(service).toBeTruthy();
  }));
});
