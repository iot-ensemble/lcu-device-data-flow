import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInfoCardsComponent } from './data-info-cards.component';

describe('DataInfoCardsComponent', () => {
  let component: DataInfoCardsComponent;
  let fixture: ComponentFixture<DataInfoCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataInfoCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInfoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
