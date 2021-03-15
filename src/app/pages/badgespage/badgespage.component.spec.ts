import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgespageComponent } from './badgespage.component';

describe('BadgespageComponent', () => {
  let component: BadgespageComponent;
  let fixture: ComponentFixture<BadgespageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgespageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
