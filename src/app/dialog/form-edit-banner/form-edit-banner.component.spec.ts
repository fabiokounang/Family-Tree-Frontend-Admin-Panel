import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditBannerComponent } from './form-edit-banner.component';

describe('FormEditBannerComponent', () => {
  let component: FormEditBannerComponent;
  let fixture: ComponentFixture<FormEditBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEditBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
