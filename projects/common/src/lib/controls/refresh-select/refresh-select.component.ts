import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IoTEnsembleTelemetry } from '../../state/iot-ensemble.state';

@Component({
  selector: 'lcu-refresh-select',
  templateUrl: './refresh-select.component.html',
  styleUrls: ['./refresh-select.component.scss'],
})
export class RefreshSelectComponent implements OnInit {
  //  Fields

  //  Properties

  /**
   * Incoming Telemetry
   */
  @Input('telemetry')
  public Telemetry: IoTEnsembleTelemetry;

  /**
   * outputs the number value of refresh rate selected
   */
  @Output('refresh-rate-changed')
  public RefreshRateChanged: EventEmitter<number>;

  /**
   * Array of numbers in seconds for user to choose from
   */
  @Input('refresh-rate-list')
  public RefreshRateList: Array<number>;

  //  Constructors

  constructor() {
    this.RefreshRateChanged = new EventEmitter();

    this.RefreshRateList = [10, 20, 30, 60];
  }

  //  Life Cycle

  public ngOnInit(): void {}

  //  API Methods

  /**
   * Updates the SelectedRefreshRate with the option selected
   *
   * and emitis the new value to update the state
   *
   * @param event the number of seconds
   */
  public SelectRefreshRate(event: any): void {
    this.RefreshRateChanged.emit(event.value);
  }

  //  Helpers
}
