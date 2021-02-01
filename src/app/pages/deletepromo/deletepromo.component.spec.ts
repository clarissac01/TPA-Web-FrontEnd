import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletepromoComponent } from './deletepromo.component';

describe('DeletepromoComponent', () => {
  let component: DeletepromoComponent;
  let fixture: ComponentFixture<DeletepromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletepromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletepromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
