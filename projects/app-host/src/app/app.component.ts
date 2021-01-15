import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  IoTEnsembleState,
  IoTEnsembleStateContext,
  BreakpointUtils,
} from '@iot-ensemble/lcu-setup-common';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  //  Fields

  //  Properties
  public IsMobile: boolean;

  @ViewChild('navDrawer')
  public NavDrawer: MatDrawer;

  public get NavDrawerMode(): string {
    return this.IsMobile ? 'over' : 'side';
  }

  public State: IoTEnsembleState;

  //  Constructors
  constructor(
    protected iotEnsCtxt: IoTEnsembleStateContext,
    protected breakpointUtils: BreakpointUtils
  ) {}

  //  Life Cycle
  public ngOnInit(): void {
    this.breakpointUtils.SetupIsMobileObserver((result) =>
      this.handleMobileObserver(result)
    );

    this.setupStateHandler();
  }

  //  API Methods
  public CloseDetailsDrawer() {
    this.iotEnsCtxt.ToggleDetailsPane();
  }

  public HeaderMenuClicked(event: MouseEvent) {
    this.NavDrawer.toggle();
  }

  //  Helpers
  protected handleMobileObserver(result?: BreakpointState) {
    this.IsMobile = result.matches;

    if (!this.IsMobile && this.NavDrawer) {
      this.NavDrawer.open();
    }
  }

  protected handleStateChanged() {
    // console.log(this.State);
  }

  protected setupStateHandler() {
    this.iotEnsCtxt.Context.subscribe((state) => {
      this.State = state;

      this.handleStateChanged();
    });
  }
}
