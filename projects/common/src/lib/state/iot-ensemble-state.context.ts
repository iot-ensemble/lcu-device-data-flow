import { Injectable, Injector } from '@angular/core';
import { StateContext } from '@lcu/common';
import { GtagCustomParams } from '../models/gtag.models';
import { GtagService } from '../services/gtag.service';
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
  constructor(protected injector: Injector, protected gtag: GtagService) {
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
  ): Promise<object> {
    console.log(
      'Calling ColdQuery',
      startDate,
      endDate,
      pageSize,
      page,
      selectedDeviceIds,
      includeEmulated,
      dataType,
      resultType,
      flatten,
      zip
    );

    const args = {
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
    };

    this.gtagEvent('ColdQuery', args);

    return this.Execute({
      Arguments: args,
      Type: 'ColdQuery',
    });
  }

  public EnrollDevice(device: IoTEnsembleDeviceEnrollment): void {
    console.log('calling enrollDevice');

    const args = {
      Device: device,
    };

    this.gtagEvent('EnrollDevice', args);

    this.Execute({
      Arguments: args,
      Type: 'EnrollDevice',
    });
  }

  public IssueDeviceSASToken(
    deviceName: string,
    expiryInSeconds: number = 0
  ): void {
    console.log('calling issueDeviceSasToken');

    const args = {
      DeviceName: deviceName,
      ExpiryInSeconds: expiryInSeconds,
    };

    this.gtagEvent('IssueDeviceSASToken', args);

    this.Execute({
      Arguments: args,
      Type: 'IssueDeviceSASToken',
    });
  }

  public ListAllDeviceNames(childEntLookup: string, filter: string): Promise<object> {
    // console.log('calling ListAllDeviceNames', childEntLookup, filter);

    const args = {
      ChildEntLookup: childEntLookup,
      Filter: filter
    };

    this.gtagEvent('ListAllDeviceNames', args);

    return this.Execute({
      Arguments: args,
      Type: 'ListAllDeviceNames',
    });
  }

  public RevokeDeviceEnrollment(deviceId: string): void {
    console.log('calling RevokeDeviceEnrollment');

    const args = {
      DeviceID: deviceId,
    };

    this.gtagEvent('RevokeDeviceEnrollment', args);

    this.Execute({
      Arguments: args,
      Type: 'RevokeDeviceEnrollment',
    });
  }

  public SendDeviceMessage(
    deviceName: string,
    payload: IoTEnsembleTelemetryPayload
  ): void {
    console.log('calling sendDeviceMessage');

    const args = {
      DeviceName: deviceName,
      Payload: payload,
    };

    this.gtagEvent('SendDeviceMessage', args);

    this.Execute({
      Arguments: args,
      Type: 'SendDeviceMessage',
    });
  }

  public ToggleDetailsPane(): void {
    console.log('calling toggleDetailsPane');

    const args = {};

    this.gtagEvent('ToggleDetailsPane', args);

    this.Execute({
      Arguments: args,
      Type: 'ToggleDetailsPane',
    });
  }

  public ToggleEmulatedEnabled(): void {
    console.log('calling ToggleEmulated');

    const args = {};

    this.gtagEvent('ToggleEmulatedEnabled', args);

    this.Execute({
      Arguments: args,
      Type: 'ToggleEmulatedEnabled',
    });
  }

  public ToggleTelemetrySync() {
    console.log('calling toggleTelemetry');

    const args = {};

    this.gtagEvent('ToggleTelemetrySync', args);

    this.Execute({
      Arguments: args,
      Type: 'ToggleTelemetrySync',
    });
  }

  public UpdateTelemetrySync(
    refreshRate: number,
    page: number,
    pageSize: number,
    payloadId: string
  ) {
    console.log('updating telemetry sync payloadId: ', payloadId);

    const args = {
      RefreshRate: refreshRate,
      Page: page,
      PageSize: pageSize,
      PayloadId: payloadId
    };

    this.gtagEvent('UpdateTelemetrySync', args);

    this.Execute({
      Arguments: args,
      Type: 'UpdateTelemetrySync',
    });
  }

  public UpdateConnectedDevicesSync(page: number, pageSize: number) {
    const args = {
      Page: page,
      PageSize: pageSize,
    };

    this.gtagEvent('UpdateConnectedDevicesSync', args);

    this.Execute({
      Arguments: args,
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
  ): Promise<object> {
    console.log('calling warmQuery', startDate, endDate, "page size:",pageSize, "page:",page, selectedDeviceIds,  includeEmulated);

    const args = {
      EndDate: endDate,
      IncludeEmulated: includeEmulated,
      Page: page,
      PageSize: pageSize,
      SelectedDeviceIDs: selectedDeviceIds,
      StartDate: startDate,
    };

    this.gtagEvent('WarmQuery', args);

    return this.Execute({
      Arguments: args,
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

  protected gtagEvent(stateAction: string, eventArgs: GtagCustomParams) {
    this.gtag.Event('state', {
      state_action: stateAction,
      state_key: this.loadStateKey(),
      state_name: this.loadStateName(),
      ...eventArgs,
    });
  }

  protected setupReceiveState(groupName: string) {
    this.rt.RegisterHandler(`ReceiveState=>${groupName}`).subscribe((req) => {
      // console.log(`Handled state from ${groupName}`);

      const diffed = this.diffState(req);

      this.subject.next(diffed);

      // console.log(diffed);
    });
  }

  protected diffState(reqState: any) {
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
