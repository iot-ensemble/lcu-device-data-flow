import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SasTokenDialogComponent } from './sas-token-dialog.component';

describe('SasTokenDialogComponent', () => {
  let component: SasTokenDialogComponent;
  let fixture: ComponentFixture<SasTokenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SasTokenDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SasTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
