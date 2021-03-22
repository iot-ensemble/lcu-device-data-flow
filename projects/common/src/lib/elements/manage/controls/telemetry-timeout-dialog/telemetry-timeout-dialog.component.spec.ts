import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryTimeoutDialogComponent } from './telemetry-timeout-dialog.component';

describe('SasTokenDialogComponent', () => {
  let component: TelemetryTimeoutDialogComponent;
  let fixture: ComponentFixture<TelemetryTimeoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelemetryTimeoutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryTimeoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
