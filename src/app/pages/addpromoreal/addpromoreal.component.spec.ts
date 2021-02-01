import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpromorealComponent } from './addpromoreal.component';

describe('AddpromorealComponent', () => {
  let component: AddpromorealComponent;
  let fixture: ComponentFixture<AddpromorealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpromorealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpromorealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
