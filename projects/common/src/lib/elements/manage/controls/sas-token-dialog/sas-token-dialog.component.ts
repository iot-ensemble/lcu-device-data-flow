import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClipboardCopyFunction } from '@lcu/common';
import {
  ColumnDefinitionModel,
  DataGridConfigModel,
  DataGridFeaturesModel,
} from '@lowcodeunit/data-grid';
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
    public dialogRef: MatDialogRef<SasTokenDialogComponent>
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
        ColWidth: '50%',
        ShowValue: true,
      }),

      new ColumnDefinitionModel({
        ColType: 'copy',
        ColWidth: '10px',
        Title: '',
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
    });

    return features;
  }
}
