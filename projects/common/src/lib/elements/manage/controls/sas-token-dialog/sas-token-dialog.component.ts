import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClipboardCopyFunction, DataPipeConstants } from '@lcu/common';
import {
  ColumnDefinitionModel,
  DataGridConfigModel,
  DataGridFeaturesModel,
} from '@lowcodeunit/data-grid';
import { GtagService } from '../../../../services/gtag.service';
import { of } from 'rxjs';
import { GenericModalModel } from '../../../../models/generice-modal.model';

@Component({
  selector: 'lcu-sas-token-dialog',
  templateUrl: './sas-token-dialog.component.html',
  styleUrls: ['./sas-token-dialog.component.scss'],
})
export class SasTokenDialogComponent implements OnInit {
  //  Fields

  //  Properties
  public GridParameters: DataGridConfigModel;

  public get SASTokenValues(): { DeviceName: string, SASToken: string }[] {
    const keys = Object.keys(this.SASTokens || {});

    return keys.map(key => {
      return {
        DeviceName: key,
        SASToken: this.SASTokens[key]
      }
    });
  }

  public SASTokens: { [deviceName: string]: string };

  //  Constructors
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: GenericModalModel,
    public dialogRef: MatDialogRef<SasTokenDialogComponent>,
    protected gtag: GtagService
  ) {}

  //  Life Cycle
  public ngOnInit(): void {
    this.SASTokens = this.data.Data.SASTokens;

    this.setupGrid();
  }

  //  API Methods
  public Close() {
    this.dialogRef.close(null);
  }

  public CopyClick(keyData: any) {
    ClipboardCopyFunction.ClipboardCopy(keyData.SASToken);

    this.gtag.Event('click', {
      event_category: 'copy',
      event_label: 'SAS Token'
    });

    keyData.$IsCopySuccessIcon = true;

    setTimeout(() => {
      keyData.$IsCopySuccessIcon = false;
    }, 2000);
  }

  //  Helpers
  protected setupGrid(): void {
    const colDefs = this.setupColumnDefs();

    const features = this.setupGridFeatures();

    this.GridParameters = new DataGridConfigModel(
      of(this.SASTokenValues),
      colDefs,
      features
    );
  }

  protected setupColumnDefs() {
    return [
      new ColumnDefinitionModel({
        ColType: 'DeviceName',
        Title: 'Device Name',
        ShowValue: true,
      }),

      new ColumnDefinitionModel({
        ColType: 'SASToken',
        Title: 'SAS Token',
        ColWidth: '35%',
        ShowValue: true,
        Tooltip: true,
        Pipe: DataPipeConstants.PIPE_STRING_SLICE_FIFTY
      }),
      // new ColumnDefinitionModel(
        // {
        //   ColType: 'actions',
        //   ColWidth: '56px',
        //   ColBGColor: '',
        //   Title: '',
        //   ShowValue: true,
        //   ShowIcon: true,
        //   IconColor: 'accent-primary-text',
        //   IconConfigFunc: () => {
        //     return 'preview'; // function that returns the material icon to display
        //   },
        //   Action:
        //   {
        //     ActionHandler: this.ViewToken.bind(this),
        //     ActionLabel: '',
        //     ActionType: 'button',
        //     ActionTooltip: 'View'
        //   }
        // }),
      new ColumnDefinitionModel({
        ColType: 'copy',
        Title: '',
        ColWidth: '56px',
        ShowValue: false,
        ShowIcon: true,
        IconColor: 'orange-accent-text',
        IconConfigFunc: (keyData: any) => {
          return keyData.$IsCopySuccessIcon ? 'done' : 'content_copy';
        },
        Action: {
          ActionHandler: this.CopyClick.bind(this),
          ActionType: 'button',
          ActionTooltip: 'Copy SAS Token',
        },
      })
    ];
  }

  protected ViewToken(val: ColumnDefinitionModel): void {
    val['$IsExpanded'] = !val['$IsExpanded'];
  }
  
  protected setupGridFeatures() {
    // const paginationDetails = new DataGridPaginationModel({
    //   PageSize: 10,
    //   PageSizeOptions: [5, 10, 25],
    // });

    const features = new DataGridFeaturesModel({
      // Paginator: paginationDetails,
      Filter: false,
      ShowLoader: true,
      RowColorEven: 'gray',
      RowColorOdd: 'light-gray',
      MobileBreakpoint: '600px'
    });

    return features;
  }
}
