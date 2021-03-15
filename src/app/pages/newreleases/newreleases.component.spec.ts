import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewreleasesComponent } from './newreleases.component';

describe('NewreleasesComponent', () => {
  let component: NewreleasesComponent;
  let fixture: ComponentFixture<NewreleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewreleasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewreleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
