import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpageGenreComponent } from './searchpage-genre.component';

describe('SearchpageGenreComponent', () => {
  let component: SearchpageGenreComponent;
  let fixture: ComponentFixture<SearchpageGenreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchpageGenreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchpageGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
