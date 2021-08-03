import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInWithComponent } from './sign-in-with.component';

describe('SignInWithComponent', () => {
  let component: SignInWithComponent;
  let fixture: ComponentFixture<SignInWithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInWithComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
