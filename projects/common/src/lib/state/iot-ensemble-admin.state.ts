import { Status } from '@lcu/common';
import { logging } from 'protractor';
import { IoTEnsembleDeviceInfo } from './iot-ensemble.state';

export class IoTEnsembleAdminState {
  public EnterpriseConfig?: IoTEnsembleEnterpriseConfig;

  public Loading?: boolean;
}

export class IoTEnsembleEnterpriseConfig {
  public ActiveEnterpriseLookup?: string;

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
