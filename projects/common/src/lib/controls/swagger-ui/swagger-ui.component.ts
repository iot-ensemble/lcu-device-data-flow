import {
  Component,
  Input,
  OnInit,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'lcu-swagger-ui',
  templateUrl: './swagger-ui.component.html',
  styleUrls: ['./swagger-ui.component.scss'],
})
export class SwaggerUIComponent implements AfterViewInit, OnInit {
  //  Fields

  //  Properties
  @Input('auth-key')
  public AuthKey: string;

  @Input('id')
  public ID: string;

  @Input('source')
  public Source: string;

  //  Constructors
  constructor(protected el: ElementRef) {
    this.ID = 'swagger-ui';

    this.Source = 'https://petstore.swagger.io/v2/swagger.json';
  }

  //  Life Cycle
  public ngAfterViewInit(): void {
    this.setupSwaggerUi();
  }

  public ngOnInit(): void {}

  //  API Methods

  //  Helpers
  protected setupSwaggerUi() {
    const swaggerCfg = {
      domNode: this.el.nativeElement,
      requestInterceptor: null,
      url: this.Source,
    };

    if (this.AuthKey) {
      swaggerCfg.requestInterceptor = (req) => {
        req.headers = {
          'lcu-subscription-key': this.AuthKey,
        };

        return req;
      };
    }

    const swag = SwaggerUI(swaggerCfg);
    // const ui = SwaggerUIBundle({
    //   dom_id: '#swagger-ui',
    //   layout: 'BaseLayout',
    //   presets: [
    //     SwaggerUIBundle.presets.apis,
    //     SwaggerUIBundle.SwaggerUIStandalonePreset,
    //   ],
    //   url: 'https://petstore.swagger.io/v2/swagger.json',
    //   docExpansion: 'none',
    //   operationsSorter: 'alpha',
    // });
  }
}
