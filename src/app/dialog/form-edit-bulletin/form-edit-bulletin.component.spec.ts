import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditBulletinComponent } from './form-edit-bulletin.component';

describe('FormEditBulletinComponent', () => {
  let component: FormEditBulletinComponent;
  let fixture: ComponentFixture<FormEditBulletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEditBulletinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
