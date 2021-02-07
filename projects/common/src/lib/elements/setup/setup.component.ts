import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';

export class LcuDeviceDataFlowSetupElementState {}

export class LcuDeviceDataFlowSetupContext extends LCUElementContext<LcuDeviceDataFlowSetupElementState> {}

export const SELECTOR_LCU_DEVICE_DATA_FLOW_SETUP_ELEMENT = 'lcu-device-data-flow-setup-element';

@Component({
  selector: SELECTOR_LCU_DEVICE_DATA_FLOW_SETUP_ELEMENT,
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class LcuDeviceDataFlowSetupElementComponent extends LcuElementComponent<LcuDeviceDataFlowSetupContext> implements OnInit {
  //  Fields

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();
  }

  //  API Methods

  //  Helpers
}
