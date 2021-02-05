import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  IoTEnsembleState,
  IoTEnsembleStateContext,
  BreakpointUtils,
  IoTEnsembleDeviceEnrollment,
  IoTEnsembleTelemetryPayload,
  AnimationService,
  OnExpandHorizontal,
  OnExpandVertical,
  AnimateOpacity
} from '@iot-ensemble/lcu-setup-common';
import { ColdQueryModel } from 'projects/common/src/lib/models/cold-query.model';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'lcu-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  animations: [OnExpandHorizontal, OnExpandVertical, AnimateOpacity],
})
export class DynamicComponent implements OnInit {
  //  Fields
  protected sideSlideSubscription: Subscription;

  //  Properties
  public IsMobile: boolean;

  /**
   * Current screen size from mediaSubscription
   */
  public MediaSize: string;

  /**
   * Subscription for media changes (screen width)
   */
  protected mediaSubscription: Subscription;

  public OnSideNavOpenClose: boolean;

  public SideNavOpenCloseEvent: boolean;

  //  Constructors
  constructor(
    protected breakpointUtils: BreakpointUtils,
    public AnimationSrvc: AnimationService,
    protected mediaObserver: MediaObserver
  ) {
  }

  //  Life Cycle
  public ngOnInit(): void {
    // this.breakpointUtils.SetupIsMobileObserver((result) =>
    //   this.handleMobileObserver(result)
    // );

    this.mediaSubscription = this.mediaObserver.asObservable()
    .pipe(
      map((changes: MediaChange[]) =>  {
        return changes[0]
      })
    ).subscribe((change: MediaChange) => {
      this.MediaSize = change.mqAlias;

      const direction: string = (this.MediaSize.toUpperCase() === 'XS' ||
                                this.MediaSize.toUpperCase() === 'SM') ? 'VERTICAL' : 'HORIZONTAL';

      this.AnimationSrvc.Direction = direction;

      // if (!this.AnimationSrvc.Direction) {
      //   this.ToggleSideNav();
      // }
    });

    this.sideSlideSubscription = this.AnimationSrvc.ExpandToggleChanged.subscribe(
      // ExpandToggleModel
      (res: any) => {
        console.log('RES', this.AnimationSrvc.IsOpen);
        if (res.Direction === 'HORIZONTAL') {

          // this.OnExpandHorizontal = res.Toggle;
        } else {
          // console.log(this.AnimationSrvc.ExpandVerticalToggleVal);
          // this.OnExpandVertical = res.Toggle;
        }
      }
    );
  }

  //  API Methods

  /**
   *
   * @param evt Animation event for open and closing side nav
   */
  public OnSideNavOpenCloseDoneEvent(evt: any): void {
    // this.SideNavOpenCloseEvent = evt.fromState === 'open' ? true : false;
  }

  public SidePanelAction(): string {

    if (!this.MediaSize) { return; }

    const mediaSize: string = this.MediaSize.toUpperCase();

    if (mediaSize === 'XS' || mediaSize === 'SM') {
      return this.AnimationSrvc.IsOpen ? 'down' : 'up';
    }

    return this.AnimationSrvc.IsOpen ? 'open' : 'close';
  }

  public ToggleSideNav(): void {
    const mediaSize: string = this.MediaSize.toUpperCase();
    // const direction: string = mediaSize === 'SM' || mediaSize === 'MD' ? 'VERTICAL' : 'HORIZONTAL';

    this.AnimationSrvc.ExpandToggle();
  }

  /**
   *
   * @param evt Animation event for open and closing side nav
   */
  public OnExpandHorizontalDoneEvent(evt: any): void {

    // this.ExpandHorizontalEvent = evt.fromState === 'open' ? true : false;
  }

  /**
   *
   * @param evt Animation event for open and closing side nav
   */
  public OnExpandVerticalDoneEvent(evt: any): void {

    // this.ExpandVerticalEvent = evt.fromState === 'down' ? true : false;
  }

  //  Helpers

  //TODO: move this to Ref Arch - shannon
  protected handleMobileObserver(result?: BreakpointState) {
    this.IsMobile = result.matches;

    // if (!this.IsMobile && this.NavDrawer) {
    //   this.NavDrawer.open();
    // }
  }
}
