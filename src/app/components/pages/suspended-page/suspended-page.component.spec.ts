import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SuspendedPageComponent } from './suspended-page.component'

describe('SuspendedPageComponent', () => {
  let component: SuspendedPageComponent
  let fixture: ComponentFixture<SuspendedPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspendedPageComponent ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendedPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
