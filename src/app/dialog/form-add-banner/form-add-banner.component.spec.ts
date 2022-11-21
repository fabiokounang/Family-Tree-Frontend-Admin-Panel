import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddBannerComponent } from './form-add-banner.component';

describe('FormAddBannerComponent', () => {
  let component: FormAddBannerComponent;
  let fixture: ComponentFixture<FormAddBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
