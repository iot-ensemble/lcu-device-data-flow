import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryDownloadDialogComponent } from './telemetry-download-dialog.component';

describe('TelemetryDownloadDialogComponent', () => {
  let component: TelemetryDownloadDialogComponent;
  let fixture: ComponentFixture<TelemetryDownloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelemetryDownloadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
