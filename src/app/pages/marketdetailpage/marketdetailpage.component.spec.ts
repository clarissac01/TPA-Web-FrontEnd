import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketdetailpageComponent } from './marketdetailpage.component';

describe('MarketdetailpageComponent', () => {
  let component: MarketdetailpageComponent;
  let fixture: ComponentFixture<MarketdetailpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketdetailpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketdetailpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
