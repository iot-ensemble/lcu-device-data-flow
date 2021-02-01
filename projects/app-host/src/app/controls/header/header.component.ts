import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IoTEnsembleState } from './../../../../../common/src/lib/state/iot-ensemble.state';

@Component({
  selector: 'lcu-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  //  Fields

  //  Properties
  @Input('billing-link')
  public BillingLink: string;
  
  @Output('menu-click')
  public MenuClicked: EventEmitter<MouseEvent>;

  @Input('show-menu')
  public ShowMenu: boolean;

  @Input('text')
  public Text: string;

  //  Constructors
  constructor() {
    this.BillingLink = "/billing/iot";
    this.MenuClicked = new EventEmitter();
  }

  //  Life Cycle
  public ngOnInit(): void {
    this.Text = 'IoT Ensemble Beta';
  }

  //  API Methods
  public MenuClick(event: MouseEvent): void {
    this.MenuClicked.emit(event)
  }

  //  Helpers
}
