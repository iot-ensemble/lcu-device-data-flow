import { GenericModalService } from './services/generic-modal.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FathymSharedModule,
  LCUServiceSettings,
  MaterialModule,
  PipeModule
} from '@lcu/common';
import { LcuSetupManageElementComponent } from './elements/manage/manage.component';
import { LcuSetupAdminElementComponent } from './elements/admin/admin.component';
import { LcuSetupDevicesElementComponent } from './elements/devices/devices.component';
import { LcuSetupSetupElementComponent } from './elements/setup/setup.component';
import { IoTEnsembleStateContext } from './state/iot-ensemble-state.context';
import { LoaderComponent } from './controls/loader/loader.component';
import { TelemetryListComponent } from './elements/controls/telemetry-list/telemetry-list.component';
import { EnabledToggleComponent } from './controls/enabled-toggle/enabled-toggle.component';
import { DevicesTableComponent } from './elements/controls/devices-table/devices-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PayloadComponent } from './elements/dynamic/payload/payload.component';
import { DataGridModule } from '@lowcodeunit/data-grid';
import { RefreshSelectComponent } from './controls/refresh-select/refresh-select.component';
import { PayloadFormComponent } from './elements/controls/payload-form/payload-form.component';
import { GenericModalComponent } from './elements/generic/generic-modal/generic-modal.component';
import { SendMessageDialogComponent } from './elements/manage/controls/send-message-dialog/send-message-dialog.component';
import { ApiAccessComponent } from './controls/api-access/api-access.component';
import { SasTokenDialogComponent } from './elements/manage/controls/sas-token-dialog/sas-token-dialog.component';
import { TelemetryDownloadDialogComponent } from './elements/manage/controls/telemetry-download-dialog/telemetry-download-dialog.component';
import { AnimationService } from './services/animation.service';

@NgModule({
  declarations: [
    LcuSetupManageElementComponent,
    LcuSetupAdminElementComponent,
    LcuSetupDevicesElementComponent,
    LcuSetupSetupElementComponent,
    LoaderComponent,
    TelemetryListComponent,
    EnabledToggleComponent,
    DevicesTableComponent,
    PayloadComponent,
    RefreshSelectComponent,
    PayloadFormComponent,
    GenericModalComponent,
    SendMessageDialogComponent,
    ApiAccessComponent,
    SasTokenDialogComponent,
    TelemetryDownloadDialogComponent
  ],
  imports: [
    FathymSharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    DataGridModule,
    PipeModule
  ],
  exports: [
    LcuSetupManageElementComponent,
    LcuSetupAdminElementComponent,
    LcuSetupDevicesElementComponent,
    LcuSetupSetupElementComponent,
    LoaderComponent,
    TelemetryListComponent,
    EnabledToggleComponent,
    DevicesTableComponent,
    PayloadComponent,
    RefreshSelectComponent,
    PayloadFormComponent,
    GenericModalComponent,
    SendMessageDialogComponent,
    ApiAccessComponent,
    SasTokenDialogComponent,
    TelemetryDownloadDialogComponent
  ],
  entryComponents: [
    LcuSetupManageElementComponent,
    LcuSetupAdminElementComponent,
    LcuSetupDevicesElementComponent,
    LcuSetupSetupElementComponent,
    PayloadComponent,
    RefreshSelectComponent,
    GenericModalComponent,
    PayloadFormComponent,
    SendMessageDialogComponent,
    SasTokenDialogComponent,
    TelemetryDownloadDialogComponent
  ],
})
export class LcuSetupModule {
  static forRoot(): ModuleWithProviders<LcuSetupModule> {
    return {
      ngModule: LcuSetupModule,
      providers: [
        IoTEnsembleStateContext,
        AnimationService,
        GenericModalService
      ],
    };
  }
}
