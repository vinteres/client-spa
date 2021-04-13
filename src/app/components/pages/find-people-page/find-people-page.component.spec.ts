import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FindPeoplePageComponent } from './find-people-page.component'

describe('FindPeoplePageComponent', () => {
  let component: FindPeoplePageComponent
  let fixture: ComponentFixture<FindPeoplePageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindPeoplePageComponent ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPeoplePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
