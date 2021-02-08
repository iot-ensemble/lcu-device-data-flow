import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FathymSharedModule, LCUServiceSettings } from '@lcu/common';
import { environment } from '../environments/environment';
import {
  LcuDeviceDataFlowModule,
  LcuDeviceDataFlowManageElementComponent,
  SELECTOR_LCU_DEVICE_DATA_FLOW_MANAGE_ELEMENT,
  LcuDeviceDataFlowAdminElementComponent,
  SELECTOR_LCU_DEVICE_DATA_FLOW_ADMIN_ELEMENT,
  LcuDeviceDataFlowDevicesElementComponent,
  SELECTOR_LCU_DEVICE_DATA_FLOW_DEVICES_ELEMENT,
  LcuDeviceDataFlowSetupElementComponent,
  SELECTOR_LCU_DEVICE_DATA_FLOW_SETUP_ELEMENT,
} from '@iot-ensemble/lcu-device-data-flow-common';
import { createCustomElement } from '@angular/elements';

import 'zone.js/dist/zone';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FathymSharedModule.forRoot(),
    LcuDeviceDataFlowModule.forRoot(),
  ],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment),
    },
  ],
  exports: [LcuDeviceDataFlowModule],
})
export class AppModule implements DoBootstrap {
  constructor(protected injector: Injector) {}

  public ngDoBootstrap() {
    const manage = createCustomElement(LcuDeviceDataFlowManageElementComponent, {
      injector: this.injector,
    });

    customElements.define(SELECTOR_LCU_DEVICE_DATA_FLOW_MANAGE_ELEMENT, manage);

    const admin = createCustomElement(LcuDeviceDataFlowAdminElementComponent, {
      injector: this.injector,
    });

    customElements.define(SELECTOR_LCU_DEVICE_DATA_FLOW_ADMIN_ELEMENT, admin);

    const devices = createCustomElement(LcuDeviceDataFlowDevicesElementComponent, {
      injector: this.injector,
    });

    customElements.define(SELECTOR_LCU_DEVICE_DATA_FLOW_DEVICES_ELEMENT, devices);

    const setup = createCustomElement(LcuDeviceDataFlowSetupElementComponent, {
      injector: this.injector,
    });

    customElements.define(SELECTOR_LCU_DEVICE_DATA_FLOW_SETUP_ELEMENT, setup);
  }
}
