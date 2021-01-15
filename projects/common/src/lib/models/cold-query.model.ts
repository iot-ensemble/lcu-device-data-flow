/**
 * Model to pass cold query data easily 
 */

import { ColdQueryDataTypes, ColdQueryResultTypes } from "../state/iot-ensemble.state";



export class ColdQueryModel {

    StartDate: Date;

    EndDate: Date;

    PageSize: number;

    Page: number;

    SelectedDeviceIds: string[];

    IncludeEmulated: boolean;

    DataType: ColdQueryDataTypes;

    ResultType: ColdQueryResultTypes;

    Flatten: boolean;

    Zip: boolean;


    constructor(DataType: ColdQueryDataTypes, 
                EndDate: Date, 
                Flatten: boolean, 
                IncludeEmulated: boolean, 
                Page: number, 
                PageSize: number, 
                ResultType: ColdQueryResultTypes,
                SelectedDeviceIds: string[], 
                StartDate: Date, 
                Zip: boolean) {

        this.DataType = DataType;
        this.EndDate = EndDate;
        this.Flatten = Flatten;
        this.IncludeEmulated = IncludeEmulated;
        this.Page = Page;
        this.PageSize = PageSize;
        this.ResultType = ResultType;
        this.SelectedDeviceIds = SelectedDeviceIds;
        this.StartDate = StartDate;
        this.Zip = Zip;

    }
}
