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
import { MatTableDataSource } from '@angular/material/table';
import {
  ColumnDefinitionModel,
  DataGridConfigModel,
  DataGridFeaturesModel,
  DataGridPaginationModel,
  DynamicComponentModel,
} from '@lowcodeunit/data-grid';
import { debug } from 'console';
import { of } from 'rxjs/internal/observable/of';
import { IoTEnsembleTelemetry } from '../../../state/iot-ensemble.state';
import { PayloadComponent } from '../../dynamic/payload/payload.component';
import { IoTEnsembleTelemetryPayload } from './../../../state/iot-ensemble.state';

@Component({
  selector: 'lcu-telemetry-list',
  templateUrl: './telemetry-list.component.html',
  styleUrls: ['./telemetry-list.component.scss'],
})
export class TelemetryListComponent implements OnChanges, OnInit {
  //  Fields

  //  Properties

  @Output('downloaded')
  public Downloaded: EventEmitter<IoTEnsembleTelemetryPayload>;

  public DynamicComponents: Array<DynamicComponentModel>;

  public GridParameters: DataGridConfigModel;

  @Output('page-event')
  public PageEvent: EventEmitter<any>;

  @Input('telemetry')
  public Telemetry: IoTEnsembleTelemetry;

  //  Constructors
  constructor() {
    this.Downloaded = new EventEmitter();

    this.PageEvent = new EventEmitter();

    this.Telemetry = { Payloads: [] };
  }

  //  Life Cycle
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.Telemetry) {
      this.updateTelemetryDataSource();
    }
  }

  public ngOnInit(): void {
    this.setupDynamicComponents();
  }

  //  API Methods

  /**
   * Copies the json payload to the clipboard while temporarily setting the copy icon to
   * a checkmark to display to the user that the content was succesfully copied
   * @param payload
   */
  public CopyClick(payload: IoTEnsembleTelemetryPayload) {
    ClipboardCopyFunction.ClipboardCopy(JSON.stringify(payload));

    payload.$IsCopySuccessIcon = true;

    setTimeout(() => {
      payload.$IsCopySuccessIcon = false;
    }, 2000);
  }

  public DownloadClick(payload: IoTEnsembleTelemetryPayload) {
    this.Downloaded.emit(payload);
  }

  public SetActivePayload(payload: IoTEnsembleTelemetryPayload) {
    payload.$IsExpanded = !payload.$IsExpanded;

    this.updateTelemetryDataSource();
  }

  public HandlePageEvent(event: any): void {
    console.log("page event t-list: ", event);
    this.PageEvent.emit(event);
  }

  //  Helpers
  protected updateTelemetryDataSource() {
    if (this.Telemetry) {
      this.setupGrid();
    }
  }

  /**
   * Setup dynamic components to inject into datagrid
   */
  protected setupDynamicComponents(): void {
    this.DynamicComponents = [
      new DynamicComponentModel({
        Component: PayloadComponent,
        Data: {},
        Label: 'JSON Payload',
      }),
    ];
  }

  /**
   * Setup all features of the grid
   */
  protected setupGrid(): void {
    const columnDefs = this.setupGridParameters();

    const features = this.setupGridFeatures();

    this.GridParameters = new DataGridConfigModel(
      of(this.Telemetry.Payloads),
      columnDefs,
      features
    );
  }

  /**
   * Create grid columns
   */
  protected setupGridParameters() {
    return [
      new ColumnDefinitionModel({
        ColType: 'DeviceID',
        Title: 'Device ID',
        ShowValue: true,
      }),
      new ColumnDefinitionModel({
        ColType: 'EventProcessedUtcTime',
        Title: 'Processed At',
        ShowValue: true,
        Pipe: DataPipeConstants.DATE_TIME_ZONE_FMT,
      }),
      //  TODO:  Move to header?
      // new ColumnDefinitionModel({
      //   ColType: 'download',
      //   ColWidth: '10px',
      //   Title: '',
      //   ShowValue: false,
      //   ShowIcon: true,
      //   IconColor: 'yellow-accent-text',
      //   IconConfigFunc: () => 'download',
      //   Action: {
      //     ActionHandler: this.DownloadClick.bind(this),
      //     ActionType: 'button',
      //     ActionTooltip: 'Download',
      //   },
      // }),
      new ColumnDefinitionModel({
        ColType: 'copy',
        ColWidth: '10px',
        Title: '',
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'orange-accent-text',
        IconConfigFunc: (rowData: IoTEnsembleTelemetryPayload) => {
          return rowData.$IsCopySuccessIcon ? 'done' : 'content_copy';
        },
        Action: {
          ActionHandler: this.CopyClick.bind(this),
          ActionType: 'button',
          ActionTooltip: 'Copy Payload',
        },
      }),
      new ColumnDefinitionModel({
        ColType: 'view', // TODO: allow no ColTypes, without setting some random value - shannon
        ColWidth: '10px',
        ColBGColor: 'rgba(111,222,333,0.00)',
        Title: '', // TODO: allow no Titles, without setting '' - shannon
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'green-accent-text',
        IconConfigFunc: (rowData: IoTEnsembleTelemetryPayload) => {
          return rowData.$IsExpanded ? 'expand_less' : 'expand_more';
        },
        Action: {
          ActionHandler: this.SetActivePayload.bind(this),
          ActionType: 'button',
          ActionTooltip: 'Payload',
        },
      }),
    ];
  }

  protected ColTooltip(rowData: IoTEnsembleTelemetryPayload): string {
    return rowData.$IsExpanded ? 'Close Payload' : 'View Payload';
  }

  /**
   * Setup grid features, such as pagination, row colors, etc.
   */
  protected setupGridFeatures() {
    console.log("TELEMETRY DATA: ", this.Telemetry)
    const paginationDetails: DataGridPaginationModel = new DataGridPaginationModel(
      {
        Length: this.Telemetry.TotalPayloads,
        PageIndex: this.Telemetry.Page,
        PageSize: this.Telemetry.PageSize,
        PageSizeOptions: [1, 5, 10, 20, 30],
      }
    );

    const features: DataGridFeaturesModel = new DataGridFeaturesModel({
      NoData: {
        ShowInline: true,
      },
      Paginator: paginationDetails,
      Filter: false,
      ShowLoader: true,
      Highlight: 'rowHighlight',
    });

    return features;
  }
}
