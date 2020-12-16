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
  ViewChild,
  AfterContentInit,
} from '@angular/core';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import {
  LCUElementContext,
  LcuElementComponent,
  LCUServiceSettings,
} from '@lcu/common';
import {
  IoTEnsembleState,
  IoTEnsembleDeviceInfo,
  IoTEnsembleDeviceEnrollment,
} from './../../state/iot-ensemble.state';
import { IoTEnsembleStateContext } from './../../state/iot-ensemble-state.context';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SideNavService } from '../../services/sidenav.service';
import { animateText, onSideNavChange } from '../../animations/animations';
import { Subscription } from 'rxjs';

declare var freeboard: any;

declare var window: any;

export class LcuSetupManageElementState {}

export class LcuSetupManageContext extends LCUElementContext<LcuSetupManageElementState> {}

export const SELECTOR_LCU_SETUP_MANAGE_ELEMENT = 'lcu-setup-manage-element';

@Component({
  selector: SELECTOR_LCU_SETUP_MANAGE_ELEMENT,
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class LcuSetupManageElementComponent
  extends LcuElementComponent<LcuSetupManageContext>
  implements OnChanges, OnInit, AfterViewInit, AfterContentInit {
  //  Fields

  //  Properties

  @Output('enroll-device')
  public EnrollDevice: EventEmitter<IoTEnsembleDeviceEnrollment>;

  public FreeboardURL: string;

  public LastSyncedAt: Date;

  @Output('revoke-device-enrollment')
  public RevokeDeviceEnrollment: EventEmitter<string>;

  @Input('state')
  public State: IoTEnsembleState;

  @Output('toggle-device-telemetry-enabled')
  public ToggleTelemetryEnabled: EventEmitter<boolean>;

  @Output('toggle-emulated-enabled')
  public ToggleEmulatedEnabled: EventEmitter<boolean>;

  public AddDeviceFormGroup: FormGroup;

  public AddingDevice: boolean;

  public ConnectedDevicesDisplayedColumns: string[];

  public DashboardIFrameURL: SafeResourceUrl;

  @Output('update-refresh-rate')
  public UpdateRefreshRate: EventEmitter<number>;

  public onSideNavChange: boolean;
  public OnSideNavChangeEvent: boolean;

  protected sideSlideSubscription: Subscription;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected sanitizer: DomSanitizer,
    protected formBldr: FormBuilder,
    protected lcuSvcSettings: LCUServiceSettings,
    public SideSlideNavService: SideNavService
  ) {
    super(injector);

    this.ConnectedDevicesDisplayedColumns = [
      'deviceName',
      'enabled',
      'lastUpdate',
      'connStr',
      'actions',
    ];

    this.EnrollDevice = new EventEmitter();

    this.RevokeDeviceEnrollment = new EventEmitter();

    this.State = {};

    this.ToggleTelemetryEnabled = new EventEmitter();

    this.ToggleEmulatedEnabled = new EventEmitter();

    this.UpdateRefreshRate = new EventEmitter();

    this.sideSlideSubscription = this.SideSlideNavService.SideNavToggleChanged.subscribe((res: boolean) => {
      this.onSideNavChange = res;
    });
  }

  //  Life Cycle
  public ngAfterContentInit() {
    // this.setupFreeboard();
  }

  public ngAfterViewInit() {
    // this.setupFreeboard();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.State) {
      this.handleStateChanged();
    }
  }

  public ngOnInit() {
    super.ngOnInit();

    this.setupAddDeviceForm();
  }

  //  API Methods
  public EnrollDeviceSubmit() {
    this.EnrollDevice.emit({
      DeviceName: this.AddDeviceFormGroup.controls.deviceName.value,
    });
  }

  public RefreshRateChanged(event: any){
    this.UpdateRefreshRate.emit(event);
  }

  public RevokeDeviceEnrollmentClick(deviceId: string) {
    this.RevokeDeviceEnrollment.emit(deviceId);
  }

  public ToggleAddingDevice() {
    this.AddingDevice = !this.AddingDevice;
  }

  public ToggleTelemetryEnabledChanged(enabled: boolean) {
    this.ToggleTelemetryEnabled.emit(enabled);
  }

  public ToggleEmulatedEnabledChanged(enabled: boolean) {
    this.ToggleEmulatedEnabled.emit(enabled);
  }

  public ToggleSideNav(): void {
    this.SideSlideNavService.SideNavToggle();
  }

  public OnSideNavChangeEnd(evt: AnimationEvent): void {

    this.OnSideNavChangeEvent = evt['fromState'] === 'open' ? true : false;
  }

  //  Helpers

  protected handleStateChanged() {
    this.setAddingDevice();

    this.setupFreeboard();

    if(this.State.Telemetry){
      this.convertToDate(this.State.Telemetry.LastSyncedAt)
    }

  }

  protected setAddingDevice() {
    this.AddingDevice = (this.State.Devices?.length || 0) <= 0;
  }


  protected convertToDate(syncDate: string){
    if(syncDate){
      this.LastSyncedAt = new Date(Date.parse(syncDate));
    }
  }

  protected setDashboardIFrameURL() {
    const source = this.State.Dashboard?.FreeboardConfig
      ? JSON.stringify(this.State.Dashboard?.FreeboardConfig)
      : '';

    this.DashboardIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.FreeboardURL}#data=${source}`
    );

    this.FreeboardURL = this.lcuSvcSettings.State.FreeboardURL || '/freeboard';
  }

  protected setupAddDeviceForm() {
    this.AddDeviceFormGroup = this.formBldr.group({
      deviceName: ['', Validators.required],
    });
  }

  protected setupFreeboard() {
    this.setDashboardIFrameURL();

    if (this.State.Dashboard && this.State.Dashboard.FreeboardConfig) {
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
