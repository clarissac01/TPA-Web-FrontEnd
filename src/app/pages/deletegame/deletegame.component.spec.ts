import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletegameComponent } from './deletegame.component';

describe('DeletegameComponent', () => {
  let component: DeletegameComponent;
  let fixture: ComponentFixture<DeletegameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletegameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
