import { TestBed } from '@angular/core/testing';

import { SuspendedGuard } from './suspended.guard';

describe('SuspendedGuard', () => {
  let guard: SuspendedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SuspendedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
