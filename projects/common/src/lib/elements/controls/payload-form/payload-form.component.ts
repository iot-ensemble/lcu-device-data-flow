import { Component, OnInit, Output, EventEmitter, Input, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IoTEnsembleTelemetryPayload } from './../../../state/iot-ensemble.state';

@Component({
  selector: 'lcu-payload-form',
  templateUrl: './payload-form.component.html',
  styleUrls: ['./payload-form.component.scss'],
})
export class PayloadFormComponent implements OnInit {
  //  Fields

  //  Properties
  @Output('canceled')
  public Canceled: EventEmitter<any>;

  @Input('device-name')
  public DeviceName: string;

  @Input('device-options')
  public DeviceOptions: string[];

  // @Input('filtered-device-options')
  // public FilteredDeviceOptions: Observable<string[]>;

  // public FilteredDeviceOptions: string[];


  @Output('filter-value')
  public FilterValue: EventEmitter<string>;

  public PayloadFormGroup: FormGroup;

  @Output('sent')
  public Sent: EventEmitter<IoTEnsembleTelemetryPayload>;

  //  Constructors
  constructor(protected el: ElementRef, 
    protected formBldr?: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) protected data?: any) {
    this.Canceled = new EventEmitter();

    this.FilterValue = new EventEmitter();

    this.Sent = new EventEmitter();
  }

  //  Life Cycle
  public ngOnInit() {
    this.setupPayloadForm();
    
    this.caseInsensitiveSort(this.data.Data.DeviceNames);

    this.PayloadFormGroup.get('deviceName').valueChanges.subscribe((filterValue: string)=>{
      this.FilterValue.emit(filterValue);
    })
  }

  public ngOnChanges(){
    if(this.DeviceOptions){
      this.caseInsensitiveSort(this.DeviceOptions);
      this.data.Data.DeviceNames = this.DeviceOptions;
    }
  }

  //  API Methods
  public Cancel() {
    this.Canceled.emit(true);
  }

  public Send() {
    const payload = this.buildPayload();

    this.Sent.emit(payload);
  }

  //  Helpers
  protected buildPayload() {
    return {
      DeviceID: this.PayloadFormGroup.controls.deviceName.value,
      DeviceType: this.PayloadFormGroup.controls.deviceType.value,
      Timestamp: new Date(),
      Version: this.PayloadFormGroup.controls.version.value || '0.0.1',
      DeviceData: JSON.parse(this.PayloadFormGroup.controls.deviceData.value || '{}'),
      SensorMetadata: JSON.parse(this.PayloadFormGroup.controls.sensorMetadata.value || '{}'),
      SensorReadings: JSON.parse(this.PayloadFormGroup.controls.sensorReadings.value || '{}'),
    } as IoTEnsembleTelemetryPayload;
  }

  protected caseInsensitiveSort(arr: Array<string>){
    this.DeviceOptions = arr.sort(function(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    
  }

  protected setupPayloadForm() {
    this.PayloadFormGroup = this.formBldr.group({
      deviceName: [this.DeviceName || '', Validators.required],
      deviceType: ['TestPayload', Validators.required],
      version: ['0.0.1', Validators.required],
      deviceData: ['{ "Floor": 10, "Room": "Conference B", "Test": true }', Validators.required],
      sensorMetadata: ['{ "_": { "Power": 0.76 }, "Temperature": { "Power": 0.93 }, "Humidity": { "Power": 0.54 } }', Validators.required],
      sensorReadings: ['{ "Temperature": 75, "Humidity": 102 }', Validators.required],
    });
  }

  
}
