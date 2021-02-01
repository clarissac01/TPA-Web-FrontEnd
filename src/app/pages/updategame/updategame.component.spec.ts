import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdategameComponent } from './updategame.component';

describe('UpdategameComponent', () => {
  let component: UpdategameComponent;
  let fixture: ComponentFixture<UpdategameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdategameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdategameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
