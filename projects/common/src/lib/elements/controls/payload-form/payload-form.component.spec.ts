import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayloadFormComponent } from './payload-form.component';

describe('PayloadFormComponent', () => {
  let component: PayloadFormComponent;
  let fixture: ComponentFixture<PayloadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayloadFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayloadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
