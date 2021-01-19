import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import {
  IoTEnsembleState,
  IoTEnsembleStateContext,
  BreakpointUtils,
  IoTEnsembleDeviceEnrollment,
  IoTEnsembleTelemetryPayload,
  animateText,
  onSideNavOpenClose,
  SideNavService,
} from '@iot-ensemble/lcu-setup-common';

@Component({
  selector: 'lcu-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  animations: [onSideNavOpenClose, animateText],
})
export class DynamicComponent implements OnInit {
  //  Fields

  //  Properties
  public IsMobile: boolean;

  public OnSideNavOpenClose: boolean;

  public SideNavOpenCloseEvent: boolean;

  public State: IoTEnsembleState;

  //  Constructors
  constructor(
    protected iotEnsCtxt: IoTEnsembleStateContext,
    protected breakpointUtils: BreakpointUtils,
    public SideNavSrvc: SideNavService
  ) {
    this.State = {};
  }

  //  Life Cycle
  public ngOnInit(): void {
    this.breakpointUtils.SetupIsMobileObserver((result) =>
      this.handleMobileObserver(result)
    );

    this.setupStateHandler();
  }

  //  API Methods
  public ColdQuery() {
    this.State.Loading = true;

    this.iotEnsCtxt.ColdQuery();
  }

  public EnrollDevice(device: IoTEnsembleDeviceEnrollment) {
    this.State.Devices.Loading = true;

    this.iotEnsCtxt.EnrollDevice(device);
  }

  public IssueDeviceSASToken(deviceName: string) {
    this.State.Devices.Loading = true;

    //  TODO:  Pass through expiry time in some way?
    this.iotEnsCtxt.IssueDeviceSASToken(deviceName, 0);
  }

  /**
   *
   * @param evt Animation event for open and closing side nav
   */
  public OnSideNavOpenCloseDoneEvent(evt: any): void {
    this.SideNavOpenCloseEvent = evt.fromState === 'open' ? true : false;
  }

  public Refresh(ctxt: string) {
    const loadingCtxt = this.State[ctxt] || this.State;

    loadingCtxt.Loading = true;

    this.iotEnsCtxt.$Refresh();
  }

  public RegenerateAPIKey(keyName: string) {
    // this.State.Loading = true;

    alert('Implement regenerate: ' + keyName);
    // this.iotEnsCtxt.RegenerateAPIKey(keyName);
  }

  public RevokeDeviceEnrollment(deviceId: string) {
    this.State.Devices.Loading = true;

    this.iotEnsCtxt.RevokeDeviceEnrollment(deviceId);
  }

  public SendDeviceMessage(payload: IoTEnsembleTelemetryPayload) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.SendDeviceMessage(payload.DeviceID, payload);
  }

  public ToggleSideNav(): void {
    this.SideNavSrvc.SideNavToggle();
  }

  public ToggleTelemetryEnabled() {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.ToggleTelemetrySync();
  }

  public ToggleEmulatedEnabled() {
    this.State.Emulated.Loading = true;

    this.iotEnsCtxt.ToggleEmulatedEnabled();
  }

  public UpdateDeviceTablePageSize(pageSize: number) {
    this.State.Devices.Loading = true;

    this.iotEnsCtxt.UpdateConnectedDevicesSync(pageSize);
  }

  public UpdatePageSize(pageSize: number) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(
      this.State.Telemetry.RefreshRate,
      pageSize
    );
  }

  public UpdateRefreshRate(refreshRate: number) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(30, this.State.Telemetry.PageSize);
  }

  public WarmQuery() {
    this.State.Loading = true;

    this.iotEnsCtxt.WarmQuery(null, null, null, null, null, true);
  }

  //  Helpers
  protected handleMobileObserver(result?: BreakpointState) {
    this.IsMobile = result.matches;

    // if (!this.IsMobile && this.NavDrawer) {
    //   this.NavDrawer.open();
    // }
  }

  protected handleStateChanged() {
    console.log(this.State);
  }

  protected setupStateHandler() {
    this.iotEnsCtxt.Context.subscribe((state) => {
      this.State = Object.assign(this.State, state);

      this.handleStateChanged();
    });
  }
}
