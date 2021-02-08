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
  IoTEnsembleState,
} from './../../state/iot-ensemble.state';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  PatternValidator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
import {
  SVGToMatIconModel,
  SvgToMatIconService,
} from '@lowcodeunit/lcu-icons-common';
import { IoTEnsembleStateContext } from '../../state/iot-ensemble-state.context';

declare var freeboard: any;

declare var window: any;

export class LcuDeviceDataFlowManageElementState {}

export class LcuDeviceDataFlowManageContext extends LCUElementContext<LcuDeviceDataFlowManageElementState> {}

export const SELECTOR_LCU_DEVICE_DATA_FLOW_MANAGE_ELEMENT = 'lcu-device-data-flow-manage-element';

@Component({
  selector: SELECTOR_LCU_DEVICE_DATA_FLOW_MANAGE_ELEMENT,
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class LcuDeviceDataFlowManageElementComponent
  extends LcuElementComponent<LcuDeviceDataFlowManageContext>
  implements OnInit, OnDestroy {
  //  Fields
  protected basePath: string;

  protected devicesSasTokensOpened: boolean;

  protected stateHandlerSub: Subscription;

  //  Properties
  public AddDeviceFormGroup: FormGroup;

  public AddingDevice: boolean;

  public get ConnectedDevicesInfoCardFlex(): string {
    const maxDeviceFlex = this.MaxDevicesReached ? '100%' : '50%';

    return this.AddingDevice ? maxDeviceFlex : '100%';
  }

  public DashboardIFrameURL: SafeResourceUrl;

  public get DeviceNameErrorText(): string {
    let errorText: string = null;

    if (this.AddDeviceFormGroup.get('deviceName').hasError('required')) {
      errorText = 'Device name is required\r\n';
    }

    if (this.AddDeviceFormGroup.get('deviceName').hasError('maxlength')) {
      errorText = 'Device name cannot be longer than 128 characters\r\n';
    }

    if (this.AddDeviceFormGroup.get('deviceName').hasError('pattern')) {
      errorText = `A case-sensitive string of ASCII 7-bit alphanumeric characters plus certain special characters: - . % _ * ? ! ( ) , : = @ $ ' \r\n`;
    }

    if (this.AddDeviceFormGroup.get('deviceName').hasError('duplicateName')) {
      errorText = ' Device name already exists \r\n';
    }

    return errorText;
  }

  public DeviceNames: string[];

  public FreeboardURL: string;

  public LastSyncedAt: Date;

  public get MaxDevicesReached(): boolean {
    return (
      this.State?.DevicesConfig?.TotalDevices >=
      this.State?.DevicesConfig?.MaxDevicesCount
    );
  }

  /**
   * Access the component passed into the modal
   */
  @ViewChild('ModalContainer', { read: ViewContainerRef })
  public ModalContainer: ViewContainerRef;

  public PipeDate: DataPipeConstants;

  public State: IoTEnsembleState;

  // @Output('update-telemetry-page')
  // public UpdateTelemetryPage: EventEmitter<number>;

  //  Constructors
  constructor(
    protected iotEnsCtxt: IoTEnsembleStateContext,
    protected dialog: MatDialog,
    protected genericModalService: GenericModalService<PayloadFormComponent>,
    protected injector: Injector,
    protected sanitizer: DomSanitizer,
    protected formBldr: FormBuilder,
    protected lcuSvcSettings: LCUServiceSettings,
    protected snackBar: MatSnackBar,
    protected resolver: ComponentFactoryResolver,
    protected svgIconsService: SvgToMatIconService
  ) {
    super(injector);

    this.State = {};

    this.PipeDate = DataPipeConstants.DATE_TIME_ZONE_FMT;
  }

  //  Life Cycle
  public ngOnDestroy(): void {
    this.stateHandlerSub?.unsubscribe();
  }

  public ngOnInit() {
    super.ngOnInit();

    this.setupStateHandler();

    this.setupAddDeviceForm();

    const icons: Array<SVGToMatIconModel> = [
      { Name: 'download', IconPath: 'download.svg' },
      { Name: 'phone', IconPath: 'phone.svg' },
    ];

    this.basePath = '/assets/icons/svgs/';

    this.svgIconsService.SetIcons(icons, this.basePath);
  }

  //  API Methods
  public ColdQuery() {
    this.State.Loading = true;

    this.iotEnsCtxt.ColdQuery();
  }

  public EnrollDeviceSubmit() {
    this.State.DevicesConfig.Loading = true;

    this.iotEnsCtxt.EnrollDevice({
      DeviceName: this.AddDeviceFormGroup.controls.deviceName.value,
    });

    this.AddDeviceFormGroup.reset();
  }

  public DeviceSASTokensModal(): void {
    // debugger;
    if (
      !this.devicesSasTokensOpened &&
      !!this.State?.DevicesConfig?.SASTokens
    ) {
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
          SASTokens: this.State?.DevicesConfig?.SASTokens,
        },
        LabelCancel: 'Close',
        // LabelAction: 'OK',
        Title: 'Device SAS Tokens',
        Width: '50%',
      });

      this.genericModalService.Open(modalConfig);

      this.genericModalService.ModalComponent.afterClosed().subscribe(
        (res: any) => {
          this.Refresh('Devices');

          this.devicesSasTokensOpened = false;
        }
      );

      this.devicesSasTokensOpened = true;
    }
  }

  public DeviceTablePageEvent(event: any) {
    if (event.pageIndex + 1 !== this.State.DevicesConfig.Page) {
      this.UpdateDeviceTablePageIndex(event.pageIndex + 1);
    } else if (event.pageSize !== this.State.DevicesConfig.PageSize) {
      this.UpdateDeviceTablePageSize(event.pageSize);
    }
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
        DeviceNames: this.State?.Telemetry.Payloads,
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
        this.TelemetryDownload(res);
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

  public HandleTelemetryPageEvent(event: any) {
    if (event.pageIndex + 1 !== this.State.Telemetry.Page) {
      this.UpdateTelemetryPage(event.pageIndex + 1);
    } else if (event.pageSize !== this.State.Telemetry.PageSize) {
      this.UpdateTelemetryPageSize(event.pageSize);
    }
  }

  public IssueDeviceSASToken(deviceName: string) {
    this.State.DevicesConfig.Loading = true;

    //  TODO:  Pass through expiry time in some way?
    this.iotEnsCtxt.IssueDeviceSASToken(deviceName, 0);
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

  public Refresh(ctxt: string) {
    const loadingCtxt = this.State[ctxt] || this.State;

    loadingCtxt.Loading = true;

    this.iotEnsCtxt.$Refresh();
  }

  public RefreshRateChanged(rate: number) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(
      rate,
      this.State.Telemetry.Page,
      this.State.Telemetry.PageSize
    );
  }

  public RegenerateAPIKey(keyName: string) {
    // this.State.Loading = true;

    alert('Implement regenerate: ' + keyName);
    // this.iotEnsCtxt.RegenerateAPIKey(keyName);
  }

  public RevokeDeviceEnrollmentClick(deviceId: string) {
    this.State.DevicesConfig.Loading = true;

    this.iotEnsCtxt.RevokeDeviceEnrollment(deviceId);
  }

  public SendDeviceMesaage(payload: IoTEnsembleTelemetryPayload) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.SendDeviceMessage(payload.DeviceID, payload);
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

  public TelemetryDownload(query: ColdQueryModel) {
    console.log('ColdQueryModelCall: ', query);

    if (!query.Zip) {
      this.iotEnsCtxt
        .ColdQuery(
          query.StartDate,
          query.EndDate,
          query.PageSize,
          query.PageSize,
          query.SelectedDeviceIds,
          query.IncludeEmulated,
          query.DataType,
          query.ResultType,
          query.Flatten,
          query.Zip
        )
        .then((obs: any) => {
          console.log('OBS: ', obs);
          const blob = new Blob([JSON.stringify(obs.body)], {
            type: 'text/json',
          });
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.download = 'telemetry.json';
          link.href = url;
          link.click();
        });
    }
  }

  public ToggleAddingDevice() {
    this.AddingDevice = !this.AddingDevice;
  }

  public ToggleEmulatedEnabledChanged(enabled: boolean) {
    this.State.Emulated.Loading = true;

    this.iotEnsCtxt.ToggleEmulatedEnabled();
  }

  public ToggleTelemetryEnabledChanged(enabled: boolean) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.ToggleTelemetrySync();
  }

  public UpdateDeviceTablePageSize(pageSize: number) {
    this.State.DevicesConfig.Loading = true;

    this.iotEnsCtxt.UpdateConnectedDevicesSync(
      this.State.DevicesConfig.Page,
      pageSize
    );
  }

  public UpdateDeviceTablePageIndex(page: number) {
    this.State.DevicesConfig.Loading = true;

    this.iotEnsCtxt.UpdateConnectedDevicesSync(
      page,
      this.State.DevicesConfig.PageSize
    );
  }

  public UpdateTelemetryPage(page: number) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(
      this.State.Telemetry.RefreshRate,
      page,
      this.State.Telemetry.PageSize
    );
  }

  public UpdateTelemetryPageSize(pageSize: number) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(
      this.State.Telemetry.RefreshRate,
      this.State.Telemetry.Page,
      pageSize
    );
  }

  public WarmQuery() {
    this.State.Loading = true;

    this.iotEnsCtxt.WarmQuery(null, null, null, null, null, true);
  }

  //  Helpers
  protected convertToDate(syncDate: string) {
    if (syncDate) {
      this.LastSyncedAt = new Date(Date.parse(syncDate));
    } else {
      this.LastSyncedAt = null;
    }
  }

  /**
   * Custom Validator to determine if the device name already exists by checking the deviceNames array
   */
  protected deviceNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      !this.DeviceNames.includes(control.value)
        ? null
        : { duplicateName: control.value };
  }

  protected handleStateChanged() {
    this.DeviceSASTokensModal();

    this.DeviceNames =
      this.State?.DevicesConfig?.Devices?.map((d) => d.DeviceName) || [];

    this.setAddingDevice();

    this.setupFreeboard();

    this.DeviceNames =
      this.State?.DevicesConfig?.Devices?.map((d) => d.DeviceName) || [];

    if (this.State?.Telemetry) {
      this.convertToDate(this.State?.Telemetry.LastSyncedAt);
    }
  }

  protected setupStateHandler() {
    this.stateHandlerSub = this.iotEnsCtxt.Context.subscribe((state) => {
      this.State = Object.assign(this.State, state);

      this.handleStateChanged();
    });
  }

  protected setAddingDevice() {
    this.AddingDevice = (this.State?.DevicesConfig?.Devices?.length || 0) <= 0;
  }

  protected setDashboardIFrameURL() {
    const source = this.State?.Dashboard?.FreeboardConfig
      ? JSON.stringify(this.State?.Dashboard?.FreeboardConfig)
      : '{}';

    this.FreeboardURL = this.lcuSvcSettings.State.FreeboardURL || '/freeboard';

    this.DashboardIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.FreeboardURL}#data=${source}`
    );
  }

  protected setupAddDeviceForm() {
    const regex: RegExp = /(^[A-Za-z0-9-\.%_\*?!(),:=@$']*$)/;
    this.AddDeviceFormGroup = this.formBldr.group({
      deviceName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(128),
          Validators.pattern(regex),
          this.deviceNameValidator(),
        ]),
      ],
    });
  }

  protected setupFreeboard() {
    this.setDashboardIFrameURL();

    if (this.State?.Dashboard && this.State?.Dashboard.FreeboardConfig) {
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
