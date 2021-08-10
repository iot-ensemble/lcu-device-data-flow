/**
 * data info model
 */

export class DataInfoModel {

    Icon: string;

    Title: string;

    TotalCount: number;

    Units?: string;


    constructor(Icon:string, Title: string, TotalCount: number, Units?: string ) {

        this.Icon = Icon,
        this.Title = Title,
        this.TotalCount = TotalCount,
        this.Units = Units

    }
}
