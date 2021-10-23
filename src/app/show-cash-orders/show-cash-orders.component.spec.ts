import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCashOrdersComponent } from './show-cash-orders.component';

describe('ShowOrdersComponent', () => {
  let component: ShowCashOrdersComponent;
  let fixture: ComponentFixture<ShowCashOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCashOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCashOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
