import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IoTEnsembleTelemetryPayload } from '../../../../state/iot-ensemble.state';
import { GenericModalModel } from '../../../../models/generice-modal.model';

@Component({
  selector: 'lcu-send-message-dialog',
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['./send-message-dialog.component.scss'],
})
export class SendMessageDialogComponent implements OnInit {
  //  Fields

  //  Properties
  public DeviceNames: string[];

  //  Constructors
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: GenericModalModel,
    public dialogRef: MatDialogRef<SendMessageDialogComponent>
  ) {}

  //  Life Cycle
  public ngOnInit(): void {
    this.DeviceNames = this.data.Data.DeviceNames;
  }

  //  API Methods
  public Cancel() {
    this.dialogRef.close(null);
  }

  public SendDeviceMesaage(payload: IoTEnsembleTelemetryPayload) {
    this.dialogRef.close(payload);
  }

  //  Helpers
}
