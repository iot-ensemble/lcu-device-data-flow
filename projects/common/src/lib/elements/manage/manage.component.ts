import {
  Component,
  OnInit,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  ElementRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
} from '@angular/core';
import {
  LCUElementContext,
  LcuElementComponent,
  LCUServiceSettings,
  DataPipeConstants,
  PipeModule,
  DataPipes,
} from '@lcu/common';
import {
  IoTEnsembleConnectedDevicesConfig,
  IoTEnsembleDashboardConfiguration,
  EmulatedDeviceInfo,
  IoTEnsembleStorageConfiguration,
  IoTEnsembleTelemetry,
  IoTEnsembleDeviceInfo,
  IoTEnsembleDeviceEnrollment,
  IoTEnsembleTelemetryPayload,
} from './../../state/iot-ensemble.state';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericModalService } from '../../services/generic-modal.service';
import { GenericModalModel } from '../../models/generice-modal.model';
import { PayloadFormComponent } from '../controls/payload-form/payload-form.component';
import { SendMessageDialogComponent } from './controls/send-message-dialog/send-message-dialog.component';
import { SasTokenDialogComponent } from './controls/sas-token-dialog/sas-token-dialog.component';
import { TelemetryDownloadDialogComponent } from './controls/telemetry-download-dialog/telemetry-download-dialog.component';
import { ColdQueryModel } from '../../models/cold-query.model';

declare var freeboard: any;

declare var window: any;

export class LcuSetupManageElementState {}

export class LcuSetupManageContext extends LCUElementContext<LcuSetupManageElementState> {}

export const SELECTOR_LCU_SETUP_MANAGE_ELEMENT = 'lcu-setup-manage-element';

@Component({
  selector: SELECTOR_LCU_SETUP_MANAGE_ELEMENT,
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class LcuSetupManageElementComponent
  extends LcuElementComponent<LcuSetupManageContext>
  implements OnChanges, OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  //  Fields
  protected componentRef: ComponentRef<any>;

  protected devicesSasTokensOpened: boolean;

  //  Properties
  public AddDeviceFormGroup: FormGroup;

  public AddingDevice: boolean;

  public get ConnectedDevicesInfoCardFlex(): string {
    const maxDeviceFlex = this.MaxDevicesReached ? '100%' : '50%';

    return this.AddingDevice ? maxDeviceFlex : '100%';
  }

  @Input('dashboard')
  public Dashboard: IoTEnsembleDashboardConfiguration;

  public DashboardIFrameURL: SafeResourceUrl;

  public DeviceNames: string[];

  @Input('devices')
  public Devices: IoTEnsembleConnectedDevicesConfig;

  @Input('emulated')
  public Emulated: EmulatedDeviceInfo;

  @Output('enroll-device')
  public EnrollDevice: EventEmitter<IoTEnsembleDeviceEnrollment>;

  public FreeboardURL: string;

  @Output('issued-device-sas-token')
  public IssuedDeviceSASToken: EventEmitter<string>;

  public LastSyncedAt: Date;

  public get MaxDevicesReached(): boolean {
    return this.Devices?.Devices?.length >= this.Devices?.MaxDevicesCount;
  }

  /**
   * Access the component passed into the modal
   */
  @ViewChild('ModalContainer', { read: ViewContainerRef })
  public ModalContainer: ViewContainerRef;

  public PipeDate: DataPipeConstants;

  @Output('refreshed')
  public Refreshed: EventEmitter<string>;

  @Output('regenerated-api-key')
  public RegeneratedAPIKey: EventEmitter<string>;

  @Output('revoke-device-enrollment')
  public RevokeDeviceEnrollment: EventEmitter<string>;

  @Output('sent-device-message')
  public SentDeviceMessage: EventEmitter<IoTEnsembleTelemetryPayload>;

  @Input('storage')
  public Storage: IoTEnsembleStorageConfiguration;

  @Input('telemetry')
  public Telemetry: IoTEnsembleTelemetry;

  @Output('telemetry-download')
  public TelemetryDownload: EventEmitter<ColdQueryModel>;

  @Output('toggle-device-telemetry-enabled')
  public ToggleTelemetryEnabled: EventEmitter<boolean>;

  @Output('toggle-emulated-enabled')
  public ToggleEmulatedEnabled: EventEmitter<boolean>;

  @Output('devices-page-event')
  public DevicesPageEvent: EventEmitter<any>;

  @Output('telemetry-page-event')
  public TelemetryPageEvent: EventEmitter<any>;

  @Output('update-refresh-rate')
  public UpdateRefreshRate: EventEmitter<number>;

  // @Output('update-telemetry-page')
  // public UpdateTelemetryPage: EventEmitter<number>;

  //  Constructors
  constructor(
    protected dialog: MatDialog,
    protected genericModalService: GenericModalService<PayloadFormComponent>,
    protected injector: Injector,
    protected sanitizer: DomSanitizer,
    protected formBldr: FormBuilder,
    protected lcuSvcSettings: LCUServiceSettings,
    protected snackBar: MatSnackBar,
    protected resolver: ComponentFactoryResolver
  ) {
    super(injector);

    this.DevicesPageEvent = new EventEmitter();

    this.EnrollDevice = new EventEmitter();

    this.IssuedDeviceSASToken = new EventEmitter();

    this.PipeDate = DataPipeConstants.DATE_TIME_ZONE_FMT;

    this.Refreshed = new EventEmitter();

    this.RegeneratedAPIKey = new EventEmitter();

    this.RevokeDeviceEnrollment = new EventEmitter();

    this.SentDeviceMessage = new EventEmitter();

    this.TelemetryDownload = new EventEmitter();

    this.ToggleTelemetryEnabled = new EventEmitter();

    this.ToggleEmulatedEnabled = new EventEmitter();

    this.TelemetryPageEvent = new EventEmitter();

    this.UpdateRefreshRate = new EventEmitter();
  }

  //  Life Cycle
  public ngAfterContentInit(): void {
    // this.setupFreeboard();
  }

  public ngOnDestroy(): void {}

  public ngAfterViewInit(): void {
    // this.setupFreeboard();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.handleStateChanged(changes);
  }

  public ngOnInit() {
    super.ngOnInit();

    this.setupAddDeviceForm();
  }

  //  API Methods
  public DeviceSASTokensModal(): void {
    if (!this.devicesSasTokensOpened && !!this.Devices?.SASTokens) {
      /**
       * Acces component properties not working - shannon
       *
       * TODO: get this working
       */
      // const tt = el.nativeElement.DeviceName;
      // payloadForm.DeviceName = 'blah;

      const modalConfig: GenericModalModel = new GenericModalModel({
        ModalType: 'data', // type of modal we want (data, confirm, info)
        CallbackAction: (val: any) => {}, // function exposed to the modal
        Component: SasTokenDialogComponent, // set component to be used inside the modal
        Data: {
          SASTokens: this.Devices?.SASTokens,
        },
        LabelCancel: 'Close',
        // LabelAction: 'OK',
        Title: 'Device SAS Tokens',
        Width: '50%',
      });

      this.genericModalService.Open(modalConfig);

      this.genericModalService.ModalComponent.afterClosed().subscribe(
        (res: any) => {
          this.Refreshed.emit('Devices');

          this.devicesSasTokensOpened = false;
        }
      );

      this.devicesSasTokensOpened = true;
    }
  }

  public DeviceTablePageEvent(event: any) {
    console.log("PAGE EVENT", event)
    this.DevicesPageEvent.emit(event);

  }

  public DownloadTelemetryModal(): void {
    /**
     * Acces component properties not working - shannon
     *
     * TODO: get this working
     */

    const modalConfig: GenericModalModel = new GenericModalModel({
      ModalType: 'data', // type of modal we want (data, confirm, info)
      CallbackAction: (val: any) => {}, // function exposed to the modal
      Component: TelemetryDownloadDialogComponent, // set component to be used inside the modal
      Data: {
        DeviceNames: this.Telemetry.Payloads,
      },
      LabelCancel: 'Cancel',
      LabelAction: 'OK',
      Title: 'Settings',
      Width: '50%',
    });

    /**
     * Pass modal config to service open function
     */
    this.genericModalService.Open(modalConfig);

    this.genericModalService.ModalComponent.afterOpened().subscribe(
      (res: any) => {
        console.log('TELEMETRY MODAL OPEN', res);
      }
    );

    this.genericModalService.ModalComponent.afterClosed().subscribe(
      (res: ColdQueryModel) => {
        console.log('TELEMETRY MODAL CLOSED', res);
        this.TelemetryDownload.emit(res);
      }
    );

    this.genericModalService
      .OnAction()
      .subscribe((payload: IoTEnsembleTelemetryPayload) => {
        console.log('ONAction', payload);

        if (payload) {
          this.SendDeviceMesaage(payload);
        }
      });
  }

  public EnrollDeviceSubmit() {
    this.EnrollDevice.emit({
      DeviceName: this.AddDeviceFormGroup.controls.deviceName.value,
    });
  }

  public HandleTelemetryPageEvent(event: any) {
    this.TelemetryPageEvent.emit(event);
  }

  public IssueDeviceSASToken(deviceName: string) {
    this.IssuedDeviceSASToken.emit(deviceName);
  }

  public PayloadFormModal(): void {
    /**
     * Acces component properties not working - shannon
     *
     * TODO: get this working
     */
    // const tt = el.nativeElement.DeviceName;
    // payloadForm.DeviceName = 'blah;

    // setTimeout(() => {
    const modalConfig: GenericModalModel = new GenericModalModel({
      ModalType: 'data', // type of modal we want (data, confirm, info)
      CallbackAction: (val: any) => {}, // function exposed to the modal
      Component: SendMessageDialogComponent, // set component to be used inside the modal
      Data: {
        DeviceNames: this.DeviceNames,
      },
      LabelCancel: 'Cancel',
      LabelAction: 'OK',
      Title: 'Settings',
      Width: '50%',
    });

    /**
     * Pass modal config to service open function
     */
    this.genericModalService.Open(modalConfig);

    this.genericModalService.ModalComponent.afterOpened().subscribe(
      (res: any) => {
        console.log('MODAL OPEN', res);
      }
    );

    this.genericModalService.ModalComponent.afterClosed().subscribe(
      (res: any) => {
        console.log('MODAL CLOSED', res);
      }
    );

    this.genericModalService
      .OnAction()
      .subscribe((payload: IoTEnsembleTelemetryPayload) => {
        console.log('ONAction', payload);

        if (payload) {
          this.SendDeviceMesaage(payload);
        }
      });
    // }, 1000);
  }

  public RefreshTelemetry(event: any) {
    this.Refreshed.emit(event);
  }

  public RefreshRateChanged(event: any) {
    this.UpdateRefreshRate.emit(event);
  }

  public RegenerateAPIKey(keyName: string) {
    this.RegeneratedAPIKey.emit(keyName);
  }

  public RevokeDeviceEnrollmentClick(deviceId: string) {
    this.RevokeDeviceEnrollment.emit(deviceId);
  }

  public SendDeviceMesaage(payload: IoTEnsembleTelemetryPayload) {
    this.SentDeviceMessage.emit(payload);
  }

  // public TelemetryDownloadSelected(){
  //   console.log("Download selected");
  //   console.log("TELE: ", this.Telemetry.Payloads)

  //   const blob = new Blob([JSON.stringify(this.Telemetry.Payloads)], { type: 'text/json' });
  //   const url= window.URL.createObjectURL(blob);

  //   let link = document.createElement("a");
  //       link.download = "telemetry.json";
  //       link.href = url;
  //       link.click();

  // }

  public ToggleAddingDevice() {
    this.AddingDevice = !this.AddingDevice;
  }

  public ToggleTelemetryEnabledChanged(enabled: boolean) {
    this.ToggleTelemetryEnabled.emit(enabled);
  }

  public ToggleEmulatedEnabledChanged(enabled: boolean) {
    this.ToggleEmulatedEnabled.emit(enabled);
  }

  //  Helpers
  protected convertToDate(syncDate: string) {
    if (syncDate) {
      this.LastSyncedAt = new Date(Date.parse(syncDate));
    }
    else{
      this.LastSyncedAt = null;
    }
  }

  protected handleStateChanged(changes: SimpleChanges) {
    if (changes.Devices) {
      this.DeviceSASTokensModal();

      this.setAddingDevice();

      this.DeviceNames = this.Devices?.Devices?.map((d) => d.DeviceName) || [];
    }

    if (changes.Dashboard) {
      this.setupFreeboard();
    }

    this.DeviceNames = this.Devices?.Devices?.map((d) => d.DeviceName) || [];

    if (changes.Telemetry) {
      if (this.Telemetry) {
        this.convertToDate(this.Telemetry.LastSyncedAt);
      }
    }
  }

  protected setAddingDevice() {
    this.AddingDevice = (this.Devices?.Devices?.length || 0) <= 0;
  }

  protected setDashboardIFrameURL() {
    const source = this.Dashboard?.FreeboardConfig
      ? JSON.stringify(this.Dashboard?.FreeboardConfig)
      : '';

    this.FreeboardURL = this.lcuSvcSettings.State.FreeboardURL || '/freeboard';

    this.DashboardIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.FreeboardURL}#data=${source}`
    );
  }

  protected setupAddDeviceForm() {
    this.AddDeviceFormGroup = this.formBldr.group({
      deviceName: ['', Validators.required],
    });
  }

  protected setupFreeboard() {
    this.setDashboardIFrameURL();

    if (this.Dashboard && this.Dashboard.FreeboardConfig) {
      //   // debugger;
      //   // freeboard.initialize(true);
      //   // const dashboard = freeboard.loadDashboard(
      //   //   this.State.Dashboard.FreeboardConfig,
      //   //   () => {
      //   //     freeboard.setEditing(false);
      //   //   }
      //   // );
      //   // console.log(dashboard);
    }
  }
}
