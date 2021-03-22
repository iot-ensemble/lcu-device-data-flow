import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClipboardCopyFunction } from '@lcu/common';
import { GtagService } from '../../../../services/gtag.service';
import { of } from 'rxjs';
import { GenericModalModel } from '../../../../models/generice-modal.model';

@Component({
  selector: 'lcu-telemetry-timeout-dialog',
  templateUrl: './telemetry-timeout-dialog.component.html',
  styleUrls: ['./telemetry-timeout-dialog.component.scss'],
})
export class TelemetryTimeoutDialogComponent implements OnInit {
  //  Fields

  //  Properties

  //  Constructors
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: GenericModalModel,
    public dialogRef: MatDialogRef<TelemetryTimeoutDialogComponent>
  ) {
  }


  //  Life Cycle
  public ngOnInit(): void {

  }

  //  API Methods
  public Close() {
    this.dialogRef.close(null);
  }

  //  Helpers
}
