import { TestBed, inject } from '@angular/core/testing';

import { KeywordInputManagerService } from './keyword-input-manager.service';

describe('KeywordInputManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeywordInputManagerService]
    });
  });

  it('should be created', inject([KeywordInputManagerService], (service: KeywordInputManagerService) => {
    expect(service).toBeTruthy();
  }));
});
