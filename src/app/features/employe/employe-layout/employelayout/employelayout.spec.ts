import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employelayout } from './employelayout';

describe('Employelayout', () => {
  let component: Employelayout;
  let fixture: ComponentFixture<Employelayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Employelayout],
    }).compileComponents();

    fixture = TestBed.createComponent(Employelayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
