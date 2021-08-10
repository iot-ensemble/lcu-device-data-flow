import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { ColdQueryModel } from 'projects/common/src/lib/models/cold-query.model';
import { GenericModalModel } from 'projects/common/src/lib/models/generice-modal.model';
// import { IoTEnsembleStateContext } from 'projects/common/src/lib/state/iot-ensemble-state.context';
import {
  ColdQueryDataTypes,
  ColdQueryResultTypes,
  IoTEnsembleState,
} from 'projects/common/src/lib/state/iot-ensemble.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'lcu-telemetry-download-dialog',
  templateUrl: './telemetry-download-dialog.component.html',
  styleUrls: ['./telemetry-download-dialog.component.scss'],
})
export class TelemetryDownloadDialogComponent implements OnInit {
  // Fields
  protected coldQueryConfig: ColdQueryModel;

  protected deviceIDs: Array<string>;

  // Properties
  public State: IoTEnsembleState;

  // Constructor
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: GenericModalModel,
    protected http: HttpClient,
    // protected iotEnsCtxt: IoTEnsembleStateContext,
    public dialogRef: MatDialogRef<TelemetryDownloadDialogComponent>
  ) {
    this.deviceIDs = [];

  }

  // Life Cycle
  ngOnInit(): void {
    this.getDeviceIDs();
  }

  // API Methods

  public Close() {
    this.dialogRef.close(null);
  }
  /**
   * Create json file and download
   */
  public JSONDownloadSelected() {
    this.coldQueryConfig = new ColdQueryModel(
      ColdQueryDataTypes.Telemetry,
      new Date(),
      false,
      false,
      1,
      10,
      ColdQueryResultTypes.JSON,
      this.deviceIDs,
      new Date(new Date().setDate(new Date().getDate() - 30)),
      false
    );
    this.closeAndDownload();
  }
  /**
   * Generate zip file and download
   */
  public ZIPDownloadSelected() {
    this.coldQueryConfig = new ColdQueryModel(
      ColdQueryDataTypes.Telemetry,
      new Date(),
      false,
      false,
      1,
      10,
      ColdQueryResultTypes.JSON,
      this.deviceIDs,
      new Date(new Date().setDate(new Date().getDate() - 30)),
      true
    );
    this.closeAndDownload();

    // obs.subscribe((resp: any) =>{
    // console.log("RESPONSE: ", resp);
    //   var zip = new JSZip();
    // zip.folder("Telemetry").file("telemetry.json", JSON.stringify(obs.body));

    // zip.generateAsync({type:"blob"})
    //   .then(function(content) {
    //   // Force down of the Zip file
    //    FileSaver.saveAs(content, "telemetry.zip");
    //   });
    // })
  }

  // Helpers

  protected getDeviceIDs() {
    this.data.Data.forEach((device) => {
      this.deviceIDs.push(device.DeviceID);
    });
    console.log('Device IDs: ', this.deviceIDs);
  }

  protected closeAndDownload() {
    this.dialogRef.close(this.coldQueryConfig);
  }
}
