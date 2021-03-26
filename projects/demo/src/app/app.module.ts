import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FathymSharedModule,
  LCUServiceSettings,
  MaterialModule,
} from '@lcu/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminComponent } from './controls/admin/admin.component';
import { HomeComponent } from './controls/home/home.component';
import { ManageComponent } from './controls/manage/manage.component';
import { LcuDocumentationModule } from '@lowcodeunit/lcu-documentation-common';
import { LcuDeviceDataFlowModule } from '@iot-ensemble/lcu-device-data-flow-common';
import { environment } from '../environments/environment';
import { AppHostModule } from '@lowcodeunit/app-host-common';

@NgModule({
  declarations: [AppComponent, HomeComponent, AdminComponent, ManageComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FathymSharedModule.forRoot(),
    MaterialModule,
    FlexLayoutModule,
    LcuDeviceDataFlowModule.forRoot(),
    AppHostModule.forRoot()
  ],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment),
    },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
