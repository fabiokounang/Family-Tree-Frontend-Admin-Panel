import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditMembercardComponent } from './form-edit-membercard.component';

describe('FormEditMembercardComponent', () => {
  let component: FormEditMembercardComponent;
  let fixture: ComponentFixture<FormEditMembercardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEditMembercardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditMembercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
