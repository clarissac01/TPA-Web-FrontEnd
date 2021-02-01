import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagegameComponent } from './managegame.component';

describe('ManagegameComponent', () => {
  let component: ManagegameComponent;
  let fixture: ComponentFixture<ManagegameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagegameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
