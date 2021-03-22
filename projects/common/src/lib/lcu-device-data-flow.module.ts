import { GenericModalService } from './services/generic-modal.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FathymSharedModule,
  MaterialModule,
  PipeModule,
} from '@lcu/common';
import { LcuDeviceDataFlowManageElementComponent } from './elements/manage/manage.component';
import { LcuDeviceDataFlowAdminElementComponent } from './elements/admin/admin.component';
import { LcuDeviceDataFlowDevicesElementComponent } from './elements/devices/devices.component';
import { LcuDeviceDataFlowSetupElementComponent } from './elements/setup/setup.component';
import { IoTEnsembleStateContext } from './state/iot-ensemble-state.context';
import { TelemetryListComponent } from './elements/controls/telemetry-list/telemetry-list.component';
import { EnabledToggleComponent } from './controls/enabled-toggle/enabled-toggle.component';
import { DevicesTableComponent } from './elements/controls/devices-table/devices-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PayloadComponent } from './elements/dynamic/payload/payload.component';
import { RefreshSelectComponent } from './controls/refresh-select/refresh-select.component';
import { PayloadFormComponent } from './elements/controls/payload-form/payload-form.component';
import { GenericModalComponent } from './elements/generic/generic-modal/generic-modal.component';
import { SendMessageDialogComponent } from './elements/manage/controls/send-message-dialog/send-message-dialog.component';
import { SasTokenDialogComponent } from './elements/manage/controls/sas-token-dialog/sas-token-dialog.component';
import { TelemetryDownloadDialogComponent } from './elements/manage/controls/telemetry-download-dialog/telemetry-download-dialog.component';
import { AnimationService } from './services/animation.service';
import { GtagService } from './services/gtag.service';
import { PageViewDirective } from './directives/analytics/page-view.directive';
import { EventDirective } from './directives/analytics/event.directive';
import { DataInfoCardsComponent } from './controls/data-info-cards/data-info-cards.component';
import { AppHostModule } from '@lowcodeunit/app-host-common';
import { TelemetryTimeoutDialogComponent } from './elements/manage/controls/telemetry-timeout-dialog/telemetry-timeout-dialog.component';

@NgModule({
  declarations: [
    LcuDeviceDataFlowManageElementComponent,
    LcuDeviceDataFlowAdminElementComponent,
    LcuDeviceDataFlowDevicesElementComponent,
    LcuDeviceDataFlowSetupElementComponent,
    TelemetryListComponent,
    EnabledToggleComponent,
    DevicesTableComponent,
    PayloadComponent,
    RefreshSelectComponent,
    PayloadFormComponent,
    GenericModalComponent,
    SendMessageDialogComponent,
    SasTokenDialogComponent,
    TelemetryDownloadDialogComponent,
    TelemetryTimeoutDialogComponent,
    PageViewDirective,
    EventDirective,
    DataInfoCardsComponent,
  ],
  imports: [
    FathymSharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    PipeModule,
    AppHostModule
  ],
  exports: [
    LcuDeviceDataFlowManageElementComponent,
    LcuDeviceDataFlowAdminElementComponent,
    LcuDeviceDataFlowDevicesElementComponent,
    LcuDeviceDataFlowSetupElementComponent,
    TelemetryListComponent,
    EnabledToggleComponent,
    DevicesTableComponent,
    PayloadComponent,
    RefreshSelectComponent,
    PayloadFormComponent,
    GenericModalComponent,
    SendMessageDialogComponent,
    SasTokenDialogComponent,
    TelemetryDownloadDialogComponent,
    TelemetryTimeoutDialogComponent,
    PageViewDirective,
    EventDirective,
    DataInfoCardsComponent,
  ],
  entryComponents: [
    LcuDeviceDataFlowManageElementComponent,
    LcuDeviceDataFlowAdminElementComponent,
    LcuDeviceDataFlowDevicesElementComponent,
    LcuDeviceDataFlowSetupElementComponent,
    PayloadComponent,
    RefreshSelectComponent,
    GenericModalComponent,
    PayloadFormComponent,
    SendMessageDialogComponent,
    SasTokenDialogComponent,
    TelemetryDownloadDialogComponent,
    TelemetryTimeoutDialogComponent,
    DataInfoCardsComponent,
  ],
})
export class LcuDeviceDataFlowModule {
  static forRoot(): ModuleWithProviders<LcuDeviceDataFlowModule> {
    return {
      ngModule: LcuDeviceDataFlowModule,
      providers: [
        IoTEnsembleStateContext,
        AnimationService,
        GenericModalService,
        GtagService,
      ],
    };
  }
}
