import { Status } from '@lcu/common';
import { logging } from 'protractor';
import { IoTEnsembleDeviceInfo } from './iot-ensemble.state';

export class IoTEnsembleAdminState {
  public Enterprise?: IoTEnsembleEnterpriseConfig;

  public Loading?: boolean;
}

export class IoTEnsembleEnterpriseConfig {
  public ActiveEnterpriseLookup?: string;

  public ChildEnterprises?: IoTEnsembleChildEnterprise[];
}

export class IoTEnsembleChildEnterprise {
  public DeviceCount?: number;

  public Devices?: IoTEnsembleDeviceInfo[];

  public Lookup?: string;

  public Name?: string;
}
