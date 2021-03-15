import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsuspensionrequestComponent } from './unsuspensionrequest.component';

describe('UnsuspensionrequestComponent', () => {
  let component: UnsuspensionrequestComponent;
  let fixture: ComponentFixture<UnsuspensionrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsuspensionrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsuspensionrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
