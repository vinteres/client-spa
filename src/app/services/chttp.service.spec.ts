import { TestBed } from '@angular/core/testing'

import { CHttp } from './chttp.service'

describe('ChttpService', () => {
  let service: CHttp

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CHttp)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
