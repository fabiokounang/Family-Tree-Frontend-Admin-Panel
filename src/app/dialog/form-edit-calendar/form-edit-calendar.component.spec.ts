import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditCalendarComponent } from './form-edit-calendar.component';

describe('FormEditCalendarComponent', () => {
  let component: FormEditCalendarComponent;
  let fixture: ComponentFixture<FormEditCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEditCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
