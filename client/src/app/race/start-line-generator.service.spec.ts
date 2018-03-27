import { TestBed, inject } from '@angular/core/testing';

import { StartLineGeneratorService } from './start-line-generator.service';

describe('StartLineGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StartLineGeneratorService]
    });
  });

  it('should be created', inject([StartLineGeneratorService], (service: StartLineGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
