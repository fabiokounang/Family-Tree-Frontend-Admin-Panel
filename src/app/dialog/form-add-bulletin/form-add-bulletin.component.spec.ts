import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddBulletinComponent } from './form-add-bulletin.component';

describe('FormAddBulletinComponent', () => {
  let component: FormAddBulletinComponent;
  let fixture: ComponentFixture<FormAddBulletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddBulletinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
