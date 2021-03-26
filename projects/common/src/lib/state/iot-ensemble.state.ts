import { Status } from '@lcu/common';

export class IoTEnsembleState {
  public AccessLicenseType?: string;

  public AccessPlanGroup?: string;

  public DataInterval?: number;

  public DataRetention?: number;

  public DevicesConfig?: IoTEnsembleConnectedDevicesConfig;

  public Dashboard?: IoTEnsembleDashboardConfiguration;

  public Drawers?: IoTEnsembleDrawersConfig;

  public Emulated?: EmulatedDeviceInfo;

  public Error?: ErrorContext;

  public HasAccess?: boolean;

  public Loading?: boolean;

  public SelectedDeviceID?: string;

  public Storage?: IoTEnsembleStorageConfiguration;

  public Telemetry?: IoTEnsembleTelemetry;

  public UserEnterpriseLookup?: string;
}

export class EmulatedDeviceInfo {
  public Enabled?: boolean;

  public Loading?: boolean;
}

export class IoTEnsembleDashboardConfiguration {
  public FreeboardConfig?: any;

  public PowerBIConfig?: any;
}

export class ErrorContext {
  public ActionPath?: string;

  public ActionTarget?: string;

  public ActionText?: string;

  public Message?: string;

  public Title?: string;
}

export class IoTEnsembleDeviceEnrollment {
  public DeviceName?: string;
}

export class IoTEnsembleConnectedDevicesConfig {
  public EnterpriseDevicesCount: number;

  public Devices?: IoTEnsembleDeviceInfo[];

  public Loading?: boolean;

  public MaxDevicesCount?: number;

  public Page?: number;

  public PageSize?: number;

  public SASTokens?: { [deviceName: string]: string };

  public Status?: Status;

  public TotalDevices?: number;
}

export class IoTEnsembleDeviceInfo {
  [prop: string]: any;

  public ActivelySendingData?: boolean;

  public AuthenticationType?: string;

  public CloudToDeviceMessageCount?: number;

  public ConnectionString?: string;

  public DeviceID?: string;

  public DeviceName?: string;

  public LastStatusUpdate?: Status;

}

export class IoTEnsembleTelemetry {

  public Enabled?: boolean;

  public Loading?: boolean;

  public Page?: number;

  public PageSize?: number;

  public Payloads?: IoTEnsembleTelemetryPayload[];

  public RefreshRate?: number;

  public LastSyncedAt?: string;

  public TotalPayloads?: number;
}

export class IoTEnsembleTelemetryPayload {
  [prop: string]: any;

  public DeviceData?: { [prop: string]: any };

  public DeviceID?: string;

  public DeviceType?: string;

  public ID?: string;

  public SensorMetadata?: { [prop: string]: any };

  public SensorReadings?: { [prop: string]: any };

  public Timestamp?: Date;

  public TotalPayloads?: number;

  public Version?: string;
}

export class IoTEnsembleDrawersConfig {
  public DetailsActive: boolean;

  public HasBackdrop: boolean;

  public NavActive: boolean;
}

export class IoTEnsembleStorageConfiguration {
  public APIKeys: IoTEnsembleAPIKeyData[];

  public OpenAPISource: string;
}

export class IoTEnsembleAPIKeyData {
  public Key: string;

  public KeyName: string;
}

export enum ColdQueryDataTypes {
  Telemetry = 'Telemetry',
  Observations = 'Observations',
  SensorMetadata = 'SensorMetadata',
}

export enum ColdQueryResultTypes {
  CSV = 'CSV',
  JSON = 'JSON',
  JSONLines = 'JSONLines',
}
