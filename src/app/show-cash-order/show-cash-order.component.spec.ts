import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCashOrderComponent } from './show-cash-order.component';

describe('ShowCashOrderComponent', () => {
  let component: ShowCashOrderComponent;
  let fixture: ComponentFixture<ShowCashOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCashOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCashOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
