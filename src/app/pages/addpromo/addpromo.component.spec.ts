import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpromoComponent } from './addpromo.component';

describe('AddpromoComponent', () => {
  let component: AddpromoComponent;
  let fixture: ComponentFixture<AddpromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
