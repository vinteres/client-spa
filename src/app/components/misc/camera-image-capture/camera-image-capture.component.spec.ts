import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraImageCaptureComponent } from './camera-image-capture.component';

describe('CameraImageCaptureComponent', () => {
  let component: CameraImageCaptureComponent;
  let fixture: ComponentFixture<CameraImageCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraImageCaptureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraImageCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
