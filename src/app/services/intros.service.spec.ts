import { TestBed } from '@angular/core/testing'

import { IntrosService } from './intros.service'

describe('IntrosService', () => {
  let service: IntrosService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(IntrosService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
