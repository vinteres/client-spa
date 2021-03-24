import { TestBed } from '@angular/core/testing';

import { ChttpService } from './chttp.service';

describe('ChttpService', () => {
  let service: ChttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
