import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepromoComponent } from './managepromo.component';

describe('ManagepromoComponent', () => {
  let component: ManagepromoComponent;
  let fixture: ComponentFixture<ManagepromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagepromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
