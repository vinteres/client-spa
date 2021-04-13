import { TestBed } from '@angular/core/testing'

import { IsNotOnboardingGuard } from './is-not-onboarding.guard'

describe('IsNotOnboardingGuard', () => {
  let guard: IsNotOnboardingGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(IsNotOnboardingGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
