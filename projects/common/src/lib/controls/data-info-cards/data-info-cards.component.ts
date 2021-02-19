import { Component, Input, OnInit } from '@angular/core';
import { DataInfoModel } from '../../models/data-info.model';

@Component({
  selector: 'lcu-data-info-cards',
  templateUrl: './data-info-cards.component.html',
  styleUrls: ['./data-info-cards.component.scss']
})
export class DataInfoCardsComponent implements OnInit {
  public DataInfo: Array<DataInfoModel>;

  public DayString: string;

  @Input('data-retention')
  public DataRetention: number;

  @Input('data-interval')
  public DataInterval: number;

  @Input('total-payloads')
  public TotalPayloads: number;

  constructor() { }

  ngOnInit(): void {
    this.convertDataRetention();
    this.buildDataInfoArray();
  }

  protected buildDataInfoArray(){
    // this.DataInfo = new Array<DataInfoModel>( );


    this.DataInfo = [
      {
      Icon:"update", 
      Title:"Data Interval", 
      TotalCount: this.DataInterval, 
      Units:"secs"
     },
     {
      Icon: "folder", 
      Title: "Telemetry", 
      TotalCount: this.TotalPayloads
     },
     {
      Icon: "date_range", 
      Title: "Data Retention", 
      TotalCount: this.DataRetention, 
      Units: this.DayString
     }

  ];


  }

  protected convertDataRetention(){
    this.DataRetention = (((this.DataRetention / 60) / 60) / 24);
    if(this.DataRetention > 1){
      this.DayString = "days"
    }
    else{
      this.DayString = "day"
    }
  }

}
