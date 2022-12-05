import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChangePasswordUserComponent } from './form-change-password-user.component';

describe('FormChangePasswordUserComponent', () => {
  let component: FormChangePasswordUserComponent;
  let fixture: ComponentFixture<FormChangePasswordUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormChangePasswordUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChangePasswordUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
