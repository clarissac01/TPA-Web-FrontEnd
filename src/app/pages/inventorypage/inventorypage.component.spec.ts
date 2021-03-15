import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorypageComponent } from './inventorypage.component';

describe('InventorypageComponent', () => {
  let component: InventorypageComponent;
  let fixture: ComponentFixture<InventorypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorypageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
