import { Component, OnInit, Injector, SimpleChanges } from '@angular/core';
import { LCUElementContext, LcuElementComponent, DataPipeConstants } from '@lcu/common';
import { ColumnDefinitionModel, DataGridConfigModel, DataGridFeaturesModel, DataGridPaginationModel } from '@lowcodeunit/data-grid';
import { of } from 'rxjs';
import { IoTEnsembleAdminState } from '../../state/iot-ensemble-admin.state';
import { IoTEnsembleStateContext } from '../../state/iot-ensemble-state.context';
import { IoTEnsembleDeviceInfo } from '../../state/iot-ensemble.state';
import { IoTEnsembleAdminStateContext } from './../../state/iot-ensemble-admin-state.context';
import { IoTEnsembleChildEnterprise } from './../../state/iot-ensemble-admin.state';

export class LcuSetupAdminElementState {}

export class LcuSetupAdminContext extends LCUElementContext<LcuSetupAdminElementState> {}

export const SELECTOR_LCU_SETUP_ADMIN_ELEMENT = 'lcu-setup-admin-element';

@Component({
  selector: SELECTOR_LCU_SETUP_ADMIN_ELEMENT,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class LcuSetupAdminElementComponent
  extends LcuElementComponent<LcuSetupAdminContext>
  implements OnInit {
  //  Fields

  //  Properties
  public ActiveChildEnterprise: IoTEnsembleChildEnterprise;

  public EnterpriseGridParameters: DataGridConfigModel;

  public GridParameters: DataGridConfigModel;

  public SelectedEnterpriseDevices: Array<IoTEnsembleDeviceInfo>;

  public SelectedEnterpriseDeviceIds: Array<string>;

  public State: IoTEnsembleAdminState;


  //  Constructors
  constructor(
    protected injector: Injector,
    protected adminCtxt: IoTEnsembleAdminStateContext,
    protected iotCtxt: IoTEnsembleStateContext
  ) {
    super(injector);

    this.State = {};

    this.SelectedEnterpriseDeviceIds =  Array<string>();
  }

  //  Life Cycle

  public ngOnInit() {
    super.ngOnInit();

    this.setupStateHandler();
  }

  //  API Methods

  public HandlePageEvent(event: any){
    console.log("Handle page event: ", event);

    this.State.Loading = true;

    this.adminCtxt.UpdateEnterprisesSync(event.pageIndex + 1, event.pageSize);
  }

  public RevokeClick(device: IoTEnsembleDeviceInfo): void {
    if (
      confirm(`Are you sure you want to remove device '${device.DeviceName}'?`)
    ) {
      this.State.Loading = true;
      this.adminCtxt.RevokeDeviceEnrollment(device.DeviceID);
    }
  }

  public RevokeChildEnterprise(ent: any): void{
    if (
      confirm(`Are you sure you want to remove child enterprise '${ent}'?`)
    ) {
      // this.State.Loading = true;
      console.log("revoking ", ent);
      // this.iotCtxt.RevokeDeviceEnrollment(device.DeviceID);
    }
  }

  public SetActiveEnterprise(enterprise: IoTEnsembleChildEnterprise) {
    this.State.Loading = true;

    this.adminCtxt.SetActiveEnterprise(enterprise.Lookup);

  }

  //  Helpers
/**
   * Setup all features of the grid
   */
  protected setupGrid(): void {
    const columndefs = this.setupGridColumns();

    const features = this.setupGridFeatures();

    this.GridParameters = new DataGridConfigModel(
      of(this.State.EnterpriseConfig.ChildEnterprises),
      columndefs,
      features
    );
  }

  protected setupEnterpriseGrid(): void{
    const columndefs = this.setupEnterpriseGridColumns();

    const features = this.setupEnterpriseGridFeatures();

    this.EnterpriseGridParameters = new DataGridConfigModel(
      of(this.SelectedEnterpriseDevices),
      columndefs,
      features
    );
  }

  /**
   * Create grid columns
   */
  protected setupEnterpriseGridColumns(): Array<ColumnDefinitionModel> {
    return [
      new ColumnDefinitionModel({
        ColType: 'DeviceName',
        Title: 'Device Name',
        ShowValue: true,
      }),

      new ColumnDefinitionModel({
        ColType: 'CloudToDeviceMessageCount',
        Title: 'Cloud to Device Messages',
        ShowValue: true,
      }),   

      new ColumnDefinitionModel({
        ColType: 'ActivelySendingData',
        Title: 'Active',
        ShowValue: true,
      }),  

      new ColumnDefinitionModel({
        ColType: 'actions',
        ColWidth: '10px',
        Title: '',
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'red-accent-text',
        IconConfigFunc: () => 'delete',
        Action: {
          ActionHandler: this.RevokeClick.bind(this),
          ActionType: 'button',
          ActionTooltip: 'Revoke',
        },
      }),

    ];
  }

  protected setupEnterpriseGridFeatures(): DataGridFeaturesModel {
    const paginationDetails: DataGridPaginationModel = new DataGridPaginationModel(
      {
        Length: this.SelectedEnterpriseDevices.length,
        PageIndex: 0,
        PageSize: 5,
        PageSizeOptions: [5, 10, 25],
      }
    );

    const features: DataGridFeaturesModel = new DataGridFeaturesModel({
      NoData: {
        ShowInline: true
      },
      Paginator: paginationDetails,
      Filter: false,
      ShowLoader: true,
      Highlight: 'rowHighlight',
      
    });

    return features;
  }

  /**
   * Create grid columns
   */
  protected setupGridColumns(): Array<ColumnDefinitionModel> {
    return [
      new ColumnDefinitionModel({
        ColType: 'Name',
        Title: 'Name',
        ShowValue: true,
      }),

      new ColumnDefinitionModel({
        ColType: 'DeviceCount',
        Title: 'Device Count',
        ShowValue: true,
      }),
      new ColumnDefinitionModel({
        ColType: 'SignUpDate',
        Title: 'Sign Up Date',
        ShowValue: true,
        Pipe: DataPipeConstants.DATE_TIME_ZONE_FMT
      }),
      new ColumnDefinitionModel({
        ColType: 'view', // TODO: allow no ColTypes, without setting some random value - shannon
        ColWidth: '10px',
        ColBGColor: 'rgba(111,222,333,0.00)',
        Title: '', // TODO: allow no Titles, without setting '' - shannon
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'green-accent-text',
        IconConfigFunc: (enterprise: IoTEnsembleChildEnterprise) => {
          return enterprise.Lookup === this.State.EnterpriseConfig.ActiveEnterpriseLookup ? 'visibility' : 'visibility_off';
        },
        Action: {
          ActionHandler: this.SetActiveEnterprise.bind(this),
          ActionType: 'button',
          ActionTooltip: 'View Enterprise Devices',
        },
      }),  

      new ColumnDefinitionModel({
        ColType: 'actions',
        ColWidth: '10px',
        Title: '',
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'red-accent-text',
        IconConfigFunc: () => 'delete',
        Action: {
          ActionHandler: this.RevokeChildEnterprise.bind(this),
          ActionType: 'button',
          ActionTooltip: 'Revoke',
        },
      }),
      
    ];
  }
  /**
   * Setup grid features, such as pagination, row colors, etc.
   */
  protected setupGridFeatures(): DataGridFeaturesModel {
    const paginationDetails: DataGridPaginationModel = new DataGridPaginationModel(
      {
        Length: this.State.EnterpriseConfig.TotalChildEnterprisesCount,
        PageIndex: this.State.EnterpriseConfig.Page - 1,
        PageSize: this.State.EnterpriseConfig.PageSize,
        PageSizeOptions: [5, 10, 25],
      }
    );

    const features: DataGridFeaturesModel = new DataGridFeaturesModel({
      NoData: {
        ShowInline: true
      },
      Paginator: paginationDetails,
      Filter: false,
      ShowLoader: true,
      Highlight: 'rowHighlight',
      
    });

    return features;
  }

  protected handleStateChanged() {
    console.log(this.State);

    if (this.State.EnterpriseConfig) {
      this.ActiveChildEnterprise = this.State.EnterpriseConfig.ChildEnterprises.find(
        (ce) => {
          return ce.Lookup === this.State.EnterpriseConfig.ActiveEnterpriseLookup;
        }
      );
    }
    if(this.State.EnterpriseConfig?.ChildEnterprises){
      this.setupGrid();
    }
    if(this.State.EnterpriseConfig?.ActiveEnterpriseLookup){

      this.SelectedEnterpriseDevices = this.State.EnterpriseConfig.ChildEnterprises.find((enterprise: IoTEnsembleChildEnterprise) => 
      enterprise.Lookup === this.State.EnterpriseConfig.ActiveEnterpriseLookup).Devices;

      this.SelectedEnterpriseDevices.forEach(device => { 
        //DeviceID has the enterpriseLookup appended to the front of the device name
        //however deviceId when returned from warm query is the deviceName
        this.SelectedEnterpriseDeviceIds.push(device.DeviceName);

      });

      console.log("device ids: ", this.SelectedEnterpriseDeviceIds);

      this.iotCtxt.WarmQuery( new Date(new Date().setDate(new Date().getDate() - 1)),
                              new Date(),
                              10, 
                              1, 
                              this.SelectedEnterpriseDeviceIds, 
                              true)
        .then((obs: any) => {
          console.log('OBS: ', obs);
          //Determine if the payload is recent
          obs.body.Payloads.forEach((payload:any) => {
            if(this.SelectedEnterpriseDeviceIds.includes(payload.DeviceID)){
              let payloadTimeMins = Math.floor((new Date(payload.EventEnqueuedUtcTime).getTime()/ (1000 * 60)));
              let currentTimeMins = Math.floor((new Date().getTime() / (1000 * 60)));
              // console.log("PAYLOAD TIME: ", payloadTimeMins)
              // console.log("CURRENT TIME: ", currentTimeMins)

              let device = this.State.EnterpriseConfig.ChildEnterprises
                .find(ent => ent.Lookup === this.State.EnterpriseConfig.ActiveEnterpriseLookup)
                .Devices.find(device => device.DeviceName === payload.DeviceID);

                if(payloadTimeMins >= currentTimeMins - 60){
                  console.log("ACTIVE")
                  device.ActivelySendingData = true;
                                          
                }
                else if(!device.ActivelySendingData){
                  console.log("NOT ACTIVE")
                  device.ActivelySendingData = false;
                }
            }
          });
                                
          const blob = new Blob([JSON.stringify(obs.body)], {
                       type: 'text/json',
                       })
        });
 
      this.setupEnterpriseGrid();
    }
  }

  protected setupStateHandler() {
    this.adminCtxt.Context.subscribe((state) => {
      this.State =  state;

      this.handleStateChanged();
    });
  }
}
