import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopuppageComponent } from './topuppage.component';

describe('TopuppageComponent', () => {
  let component: TopuppageComponent;
  let fixture: ComponentFixture<TopuppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopuppageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopuppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
