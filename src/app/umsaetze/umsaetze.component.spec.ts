import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmsaetzeComponent } from './umsaetze.component';

describe('UmsaetzeComponent', () => {
  let component: UmsaetzeComponent;
  let fixture: ComponentFixture<UmsaetzeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UmsaetzeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UmsaetzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
