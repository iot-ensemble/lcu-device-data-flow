import { Directive, Input, Optional, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { GtagService } from '../../services/gtag.service';

@Directive({
  selector: '[lcuPageView]',
})
export class PageViewDirective implements OnChanges {
  //  Fields

  //  Properties
  @Input('location')
  public Location: string;

  @Input('path')
  public Path: string;

  @Input('screen-view')
  public IsScreenView: boolean;

  @Input('gtag')
  public Title: string;

  //  Constructors
  constructor(
    protected gtag: GtagService,
    @Optional() protected router: Router
  ) {}

  //  Life Cycle
  public ngOnChanges() {
    if (this.Title) {
      let location = this.Location;

      if (location?.startsWith('#')) {
        location = `${this.router?.url}${location}`;
      }

      if (!this.Location) {
        location = this.router?.url;
      }

      if (!this.IsScreenView) {
        this.gtag.PageView(this.Title, this.Path, location);
      } else {
        this.gtag.ScreenView(this.Title, location, this.Path);
      }
    }
  }

  //  API Methods

  //  Helpers
}
