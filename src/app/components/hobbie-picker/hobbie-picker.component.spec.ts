import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbiePickerComponent } from './hobbie-picker.component';

describe('HobbiePickerComponent', () => {
  let component: HobbiePickerComponent;
  let fixture: ComponentFixture<HobbiePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HobbiePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HobbiePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
