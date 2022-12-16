import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddMembercardComponent } from './form-add-membercard.component';

describe('FormAddMembercardComponent', () => {
  let component: FormAddMembercardComponent;
  let fixture: ComponentFixture<FormAddMembercardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddMembercardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddMembercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
