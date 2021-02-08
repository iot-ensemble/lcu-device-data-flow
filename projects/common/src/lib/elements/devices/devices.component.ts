import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';

export class LcuDeviceDataFlowDevicesElementState {}

export class LcuDeviceDataFlowDevicesContext extends LCUElementContext<LcuDeviceDataFlowDevicesElementState> {}

export const SELECTOR_LCU_DEVICE_DATA_FLOW_DEVICES_ELEMENT = 'lcu-device-data-flow-devices-element';

@Component({
  selector: SELECTOR_LCU_DEVICE_DATA_FLOW_DEVICES_ELEMENT,
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class LcuDeviceDataFlowDevicesElementComponent extends LcuElementComponent<LcuDeviceDataFlowDevicesContext> implements OnInit {
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
