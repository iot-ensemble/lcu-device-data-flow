import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicComponent } from './pages/dynamic/dynamic.component';
import { HeaderComponent } from './controls/header/header.component';
import { FooterComponent } from './controls/footer/footer.component';
import {
  FathymSharedModule,
  LCUServiceSettings,
  MaterialModule,
  PipeModule
} from '@lcu/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LcuSetupModule } from '@iot-ensemble/lcu-setup-common';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DynamicComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FathymSharedModule.forRoot(),
    LcuSetupModule.forRoot(),
    PipeModule
  ],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment),
    },
  ],
  bootstrap: [AppComponent],
  exports: [DynamicComponent, HeaderComponent, FooterComponent],
})
export class AppModule {}
