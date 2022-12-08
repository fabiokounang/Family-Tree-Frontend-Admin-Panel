import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembercardComponent } from './membercard.component';

describe('MembercardComponent', () => {
  let component: MembercardComponent;
  let fixture: ComponentFixture<MembercardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembercardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
