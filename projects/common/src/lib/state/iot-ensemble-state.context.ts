import { Injectable, Injector } from '@angular/core';
import { StateContext } from '@lcu/common';
import {
  ColdQueryResultTypes,
  IoTEnsembleDeviceEnrollment,
  IoTEnsembleState,
  IoTEnsembleTelemetryPayload,
  ColdQueryDataTypes,
} from './iot-ensemble.state';

@Injectable({
  providedIn: 'root',
})
export class IoTEnsembleStateContext extends StateContext<IoTEnsembleState> {
  // Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  protected oldState: IoTEnsembleState = {};

  // API Methods
  public ColdQuery(
    startDate: Date = new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: Date = new Date(),
    pageSize: number = 10,
    page: number = 1,
    selectedDeviceIds: string[] = [],
    includeEmulated: boolean = false,
    dataType: ColdQueryDataTypes = ColdQueryDataTypes.Telemetry,
    resultType: ColdQueryResultTypes = ColdQueryResultTypes.JSON,
    flatten: boolean = false,
    zip: boolean = false
  ) {
    this.Execute({
      Arguments: {
        DataType: dataType,
        EndDate: endDate,
        Flatten: flatten,
        IncludeEmulated: includeEmulated,
        Page: page,
        PageSize: pageSize,
        ResultType: resultType,
        SelectedDeviceIDs: selectedDeviceIds,
        StartDate: startDate,
        Zip: zip,
      },
      Type: 'ColdQuery',
    });
  }

  public EnrollDevice(device: IoTEnsembleDeviceEnrollment): void {
    this.Execute({
      Arguments: {
        Device: device,
      },
      Type: 'EnrollDevice',
    });
  }

  public IssueDeviceSASToken(
    deviceName: string,
    expiryInSeconds: number = 0
  ): void {
    this.Execute({
      Arguments: {
        DeviceName: deviceName,
        ExpiryInSeconds: expiryInSeconds,
      },
      Type: 'IssueDeviceSASToken',
    });
  }

  public RevokeDeviceEnrollment(deviceId: string): void {
    this.Execute({
      Arguments: {
        DeviceID: deviceId,
      },
      Type: 'RevokeDeviceEnrollment',
    });
  }

  public SendDeviceMessage(
    deviceName: string,
    payload: IoTEnsembleTelemetryPayload
  ): void {
    this.Execute({
      Arguments: {
        DeviceName: deviceName,
        Payload: payload,
      },
      Type: 'SendDeviceMessage',
    });
  }

  public ToggleDetailsPane(): void {
    this.Execute({
      Arguments: {},
      Type: 'ToggleDetailsPane',
    });
  }

  public ToggleEmulatedEnabled(): void {
    this.Execute({
      Arguments: {},
      Type: 'ToggleEmulatedEnabled',
    });
  }

  public ToggleTelemetrySync() {
    this.Execute({
      Arguments: {},
      Type: 'ToggleTelemetrySync',
    });
  }

  public UpdateTelemetrySync(refreshRate: number, pageSize: number) {
    this.Execute({
      Arguments: {
        RefreshRate: 30,
        PageSize: pageSize,
      },
      Type: 'UpdateTelemetrySync',
    });
  }

  public UpdateConnectedDevicesSync(pageSize: number) {
    this.Execute({
      Arguments: {
        PageSize: pageSize,
      },
      Type: 'UpdateConnectedDevicesSync',
    });
  }

  public WarmQuery(
    startDate: Date = new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: Date = new Date(),
    pageSize: number = 10,
    page: number = 1,
    selectedDeviceIds: string[] = [],
    includeEmulated: boolean = false
  ) {
    this.Execute({
      Arguments: {
        EndDate: endDate,
        IncludeEmulated: includeEmulated,
        Page: page,
        PageSize: pageSize,
        SelectedDeviceIDs: selectedDeviceIds,
        StartDate: startDate,
      },
      Type: 'WarmQuery',
    });
  }

  //  Helpers
  protected defaultValue() {
    return { Loading: true } as IoTEnsembleState;
  }

  protected loadStateKey(): string {
    return 'shared';
  }

  protected loadStateName(): string {
    return 'iotensemble';
  }

  protected setupReceiveState(groupName: string) {
    this.rt.RegisterHandler(`ReceiveState=>${groupName}`).subscribe((req) => {
      console.log(`Handled state from ${groupName}`);

      const diffed = this.diffState(req);

      this.subject.next(diffed);

      console.log(diffed);
    });
  }

  protected diffState(reqState: any) {
    // debugger;
    const stateKeys = Object.keys(reqState);

    const diffed = {};

    stateKeys.forEach((stateKey) => {
      const reqVal = JSON.stringify(reqState[stateKey]);

      const oldVal = JSON.stringify(this.oldState[stateKey]);

      if (reqVal !== oldVal) {
        diffed[stateKey] = reqState[stateKey];
      }
    });

    this.oldState = reqState;

    return diffed;
  }
}
