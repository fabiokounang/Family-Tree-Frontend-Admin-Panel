import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddCalendarComponent } from './form-add-calendar.component';

describe('FormAddCalendarComponent', () => {
  let component: FormAddCalendarComponent;
  let fixture: ComponentFixture<FormAddCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
