import { IoTEnsembleDeviceInfo } from './iot-ensemble.state';

export class IoTEnsembleAdminState {
  public ActiveEnterpriseConfig?: IoTEnsembleActiveEnterpriseConfig;

  public EnterpriseConfig?: IoTEnsembleEnterpriseConfig;

  public Loading?: boolean;
}

export class IoTEnsembleActiveEnterpriseConfig {
  public ActiveEnterprise: IoTEnsembleChildEnterprise;

  public Page: number;

  public PageSize: number;
}


export class IoTEnsembleEnterpriseConfig {

  public ChildEnterprises?: IoTEnsembleChildEnterprise[];

  public TotalChildEnterprisesCount?: number;

  public Page?: number;

  public PageSize?: number;

}

export class IoTEnsembleChildEnterprise {
  public DeviceCount?: number;

  public Devices?: IoTEnsembleDeviceInfo[];

  public Lookup?: string;

  public Name?: string;
}
