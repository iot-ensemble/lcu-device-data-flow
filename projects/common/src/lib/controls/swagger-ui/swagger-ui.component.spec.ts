import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaggerUIComponent } from './swagger-ui.component';

describe('SwaggerUIComponent', () => {
  let component: SwaggerUIComponent;
  let fixture: ComponentFixture<SwaggerUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwaggerUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwaggerUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
