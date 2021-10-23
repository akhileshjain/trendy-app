import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCashOrderComponent } from './create-cash-order.component';

describe('CreateOrderComponent', () => {
  let component: CreateCashOrderComponent;
  let fixture: ComponentFixture<CreateCashOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCashOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCashOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
