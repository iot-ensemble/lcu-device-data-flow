import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ClipboardCopyFunction, DataPipeConstants } from '@lcu/common';
import {
  ColumnDefinitionModel,
  DataGridConfigModel,
  DataGridFeaturesModel,
  DataGridPaginationModel,
} from '@lowcodeunit/data-grid';
import { of } from 'rxjs';
import { IoTEnsembleDeviceInfo } from '../../../state/iot-ensemble.state';

@Component({
  selector: 'lcu-devices-table',
  templateUrl: './devices-table.component.html',
  styleUrls: ['./devices-table.component.scss'],
})
export class DevicesTableComponent implements OnInit, OnChanges {
  //  Fields

  //  Properties
  @Input('devices')
  public Devices?: IoTEnsembleDeviceInfo[];

  @Input('displayed-columns')
  public DisplayedColumns: string[];

  public GridParameters: DataGridConfigModel;

  @Output('issued-sas-token')
  public IssuedSASToken: EventEmitter<string>;

  @Output('page-size-changed')
  public PageSizeChanged: EventEmitter<any>;

  @Output('revoked')
  public Revoked: EventEmitter<string>;

  //  Constructors
  constructor() {
    this.Devices = [];

    this.IssuedSASToken = new EventEmitter();

    this.PageSizeChanged = new EventEmitter();

    this.Revoked = new EventEmitter();
  }

  //  Life Cycle

  public ngOnChanges(changes: SimpleChanges): void {
    // console.log('CHANGES: ', changes);
    if (changes.Devices) {
      this.updateDevicesDataSource();
    }
  }

  public ngOnInit(): void {}

  //  API Methods
  /**
   * Copies the connection string to the clipboard while temporarily setting the copy icon to
   * a checkmark to display to the user that the content was succesfully copied
   * @ param deviceInfo
   */
  public CopyClick(deviceInfo: IoTEnsembleDeviceInfo): void {
    ClipboardCopyFunction.ClipboardCopy(deviceInfo.ConnectionString);

    deviceInfo.$IsCopySuccessIcon = true;

    setTimeout(() => {
      deviceInfo.$IsCopySuccessIcon = false;
    }, 2000);
  }

  public IssueSASToken(device: IoTEnsembleDeviceInfo): void {
    this.IssuedSASToken.emit(device.DeviceName);
  }

  public HandlePageEvent(event: any): void {
    console.log("PaGe EvEnT: ", event);
    this.PageSizeChanged.emit(event.pageSize);
  }

  public RevokeClick(device: IoTEnsembleDeviceInfo): void {
    if (
      confirm(`Are you sure you want to remove device '${device.DeviceName}'?`)
    ) {
      this.Revoked.emit(device.DeviceID);
    }
  }

  //  Helpers
  /**
   * Setup all features of the grid
   */
  protected setupGrid(): void {
    const columndefs = this.setupGridColumns();

    const features = this.setupGridFeatures();

    this.GridParameters = new DataGridConfigModel(
      of(this.Devices),
      columndefs,
      features
    );
  }

  /**
   * Create grid columns
   */
  protected setupGridColumns(): Array<ColumnDefinitionModel> {
    return [
      new ColumnDefinitionModel({
        ColType: 'DeviceName',
        Title: 'Device Name',
        ShowValue: true,
      }),

      new ColumnDefinitionModel({
        ColType: 'ConnectionString',
        Title: 'Connection String',
        ShowValue: true,
        ShowIcon: true,
        Pipe: DataPipeConstants.PIPE_STRING_SLICE_SEVENTY,
      }),

      new ColumnDefinitionModel({
        ColType: 'copy',
        ColWidth: '10px',
        Title: '',
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'orange-accent-text',
        IconConfigFunc: (rowData: IoTEnsembleDeviceInfo) => {
          return rowData.$IsCopySuccessIcon ? 'done' : 'content_copy';
        },
        Action: {
          ActionHandler: this.CopyClick.bind(this),
          ActionType: 'button',
          ActionTooltip: 'Copy Connection String',
        },
      }),

      new ColumnDefinitionModel({
        ColType: 'issue-sas-token',
        ColWidth: '10px',
        Title: '',
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'yellow-accent-text',
        IconConfigFunc: () => 'build_circle',
        Action: {
          ActionHandler: this.IssueSASToken.bind(this),
          ActionType: 'button',
          ActionTooltip: 'Issue SAS Token',
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
          ActionHandler: this.RevokeClick.bind(this),
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
        // Length: this.Telemetry.TotalPayloads,
        // PageIndex: this.Telemetry.Page - 1,
        PageSize: 10,
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
      RowColorEven: 'gray',
      RowColorOdd: 'light-gray',
    });

    return features;
  }

  protected updateDevicesDataSource(): void {
    if (this.Devices) {
      // console.log('DEVICES: ', this.Devices);

      this.setupGrid();
    }
  }
}
