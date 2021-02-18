import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-data-info-cards',
  templateUrl: './data-info-cards.component.html',
  styleUrls: ['./data-info-cards.component.scss']
})
export class DataInfoCardsComponent implements OnInit {

  @Input('data-retention')
  public DataRetention: string;

  @Input('refresh-rate')
  public RefreshRate: number;

  @Input('total-payloads')
  public TotalPayloads: number;

  constructor() { }

  ngOnInit(): void {
  }

}
