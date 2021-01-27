import { Injectable, Injector } from '@angular/core';
import { StateContext } from '@lcu/common';
import { lookup } from 'dns';
import { GtagCustomParams } from '../models/gtag.models';
import { GtagService } from '../services/gtag.service';
import { IoTEnsembleAdminState } from './iot-ensemble-admin.state';
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
export class IoTEnsembleAdminStateContext extends StateContext<IoTEnsembleAdminState> {
  // Constructors
  constructor(protected injector: Injector, protected gtag: GtagService) {
    super(injector);
  }

  protected oldState: IoTEnsembleAdminState = {};

  // API Methods
  public SetActiveEnterprise(lookup: string) {
    console.log('Setting active enterprise');

    const args = {
      Lookup: lookup,
    };

    this.gtagEvent('SetActiveEnterprise', args);

    this.Execute({
      Arguments: args,
      Type: 'SetActiveEnterprise',
    });
  }

  //  Helpers
  protected defaultValue() {
    return { Loading: true } as IoTEnsembleState;
  }

  protected loadStateKey(): string {
    return 'admin';
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
