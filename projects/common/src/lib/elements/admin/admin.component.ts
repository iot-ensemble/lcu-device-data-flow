import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { IoTEnsembleAdminState } from '../../state/iot-ensemble-admin.state';
import { IoTEnsembleAdminStateContext } from './../../state/iot-ensemble-admin-state.context';
import { IoTEnsembleChildEnterprise } from './../../state/iot-ensemble-admin.state';

export class LcuDeviceDataFlowAdminElementState {}

export class LcuDeviceDataFlowAdminContext extends LCUElementContext<LcuDeviceDataFlowAdminElementState> {}

export const SELECTOR_LCU_DEVICE_DATA_FLOW_ADMIN_ELEMENT = 'lcu-device-data-flow-admin-element';

@Component({
  selector: SELECTOR_LCU_DEVICE_DATA_FLOW_ADMIN_ELEMENT,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class LcuDeviceDataFlowAdminElementComponent
  extends LcuElementComponent<LcuDeviceDataFlowAdminContext>
  implements OnInit {
  //  Fields

  //  Properties
  public ActiveChildEnterprise: IoTEnsembleChildEnterprise;

  public State: IoTEnsembleAdminState;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected adminCtxt: IoTEnsembleAdminStateContext
  ) {
    super(injector);

    this.State = {};
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.setupStateHandler();
  }

  //  API Methods
  public SetActiveEnterprise(lookup: string) {
    this.State.Loading = true;

    this.adminCtxt.SetActiveEnterprise(lookup);
  }

  //  Helpers
  protected handleStateChanged() {
    console.log(this.State);

    if (this.State.Enterprise) {
      this.ActiveChildEnterprise = this.State.Enterprise.ChildEnterprises.find(
        (ce) => {
          return ce.Lookup === this.State.Enterprise.ActiveEnterpriseLookup;
        }
      );
    }
  }

  protected setupStateHandler() {
    this.adminCtxt.Context.subscribe((state) => {
      this.State = Object.assign(this.State, state);

      this.handleStateChanged();
    });
  }
}
