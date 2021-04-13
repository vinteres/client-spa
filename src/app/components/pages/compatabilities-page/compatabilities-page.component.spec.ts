import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CompatabilitiesPageComponent } from './compatabilities-page.component'

describe('CompatabilitiesPageComponent', () => {
  let component: CompatabilitiesPageComponent
  let fixture: ComponentFixture<CompatabilitiesPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompatabilitiesPageComponent ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatabilitiesPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
