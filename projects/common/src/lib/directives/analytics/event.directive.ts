import { Directive, HostListener, Input } from '@angular/core';
import { GtagService } from '../../services/gtag.service';

@Directive({
  selector: '[lcuEvent]',
})
export class EventDirective {
  //  Fields

  //  Properties
  @Input('lcuEvent')
  public Action: string;

  @Input('category')
  public Category: string;

  @Input('label')
  public Label: string;

  @Input('value')
  public Value: number;

  //  Constructors
  constructor(protected gtag: GtagService) {}

  //  Life Cycle

  //  API Methods
  @HostListener('click')
  public OnClick() {
    this.gtag.Event(this.Action, {
      event_category: this.Category,
      event_label: this.Label,
      event_value: this.Value,
    });
  }

  //  Helpers
}
