import { TestBed } from '@angular/core/testing';

import { SearchPreferenceService } from './search-preference.service';

describe('SearchPreferenceService', () => {
  let service: SearchPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchPreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
