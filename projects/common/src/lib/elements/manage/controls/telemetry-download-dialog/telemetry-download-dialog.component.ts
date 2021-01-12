import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { GenericModalModel } from 'projects/common/src/lib/models/generice-modal.model';
import { IoTEnsembleStateContext } from 'projects/common/src/lib/state/iot-ensemble-state.context';
import { ColdQueryDataTypes, ColdQueryResultTypes, IoTEnsembleState } from 'projects/common/src/lib/state/iot-ensemble.state';

@Component({
  selector: 'lcu-telemetry-download-dialog',
  templateUrl: './telemetry-download-dialog.component.html',
  styleUrls: ['./telemetry-download-dialog.component.scss']
})
export class TelemetryDownloadDialogComponent implements OnInit {
  //Fields
  //Properties
  protected DeviceIDs: Array<string>;

  public State: IoTEnsembleState;

  //Constructor
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: GenericModalModel,
    protected  http: HttpClient,
    protected iotEnsCtxt: IoTEnsembleStateContext,
    public dialogRef: MatDialogRef<TelemetryDownloadDialogComponent>
  ) { 

    this.DeviceIDs = [];

    this.State = {};
    
  }


  //Life Cycle
  ngOnInit(): void {
    this.iotEnsCtxt.Context.subscribe((state: IoTEnsembleState) => {
      this.State = state;
      // console.log("STATE: ", this.State);
      this.stateChanged();
    })
  }


  //API Methods

  public Close() {
    this.dialogRef.close(null);
  }
/**
 * Create json file and download
 */
  public JSONDownloadSelected(){
    console.log("JSON Download selected");
    console.log("TELE: ", this.data)

    const blob = new Blob([JSON.stringify(this.data)], { type: 'text/json' });
    const url= window.URL.createObjectURL(blob);

    let link = document.createElement("a");
        link.download = "telemetry.json";
        link.href = url;
        link.click();
  }
/**
 * Generate zip file and download
 */
  public ZIPDownloadSelected(){
    
    this.iotEnsCtxt.ColdQuery(new Date(new Date().setDate(new Date().getDate() - 30)), new Date(),10,1,this.DeviceIDs,false,ColdQueryDataTypes.Telemetry,ColdQueryResultTypes.JSON,false,true).then((obs) =>{
      // console.log("OBS: ", obs)
      obs.subscribe((resp: any) =>{
        console.log("RESPONSE: ", resp);
      });
    })

   
    
  
    // let that = this;
    // setTimeout(function(){
      // that.getHeaders();
    // },1000);


      // var zip = new JSZip();
      // zip.folder("Telemetry").file("telemetry.json", JSON.stringify(this.data));

      // zip.generateAsync({type:"blob"})
      //   .then(function(content) {
      //   // Force down of the Zip file
      //    FileSaver.saveAs(content, "telemetry.zip");
      //   });
  }

    //Helpers

    protected getHeaders(){

    this.http.get('https://www.iot-ensemble.com/api/state/iotensemble/ColdQuery', 
    {observe: 'response'}).subscribe(resp => {

      console.log("HEADERS", resp.headers);
    
    });
    }

    protected getDeviceIDs(){
      this.State.Devices.Devices.forEach(device => {
        this.DeviceIDs.push(device.DeviceID);
      });
      console.log("Device IDs: ", this.DeviceIDs);
    }

    protected stateChanged(){
      console.log("State From telemetry MODAL: ", this.State);
      if(this.State.Devices){
        this.getDeviceIDs();
      }
      
    }


}
