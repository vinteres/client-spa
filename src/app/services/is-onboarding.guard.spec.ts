import { TestBed } from '@angular/core/testing'

import { IsOnboardingGuard } from './is-onboarding.guard'

describe('IsOnboardingGuard', () => {
  let guard: IsOnboardingGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(IsOnboardingGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
