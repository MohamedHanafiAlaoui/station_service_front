import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clientlayout } from './clientlayout';

describe('Clientlayout', () => {
  let component: Clientlayout;
  let fixture: ComponentFixture<Clientlayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clientlayout],
    }).compileComponents();

    fixture = TestBed.createComponent(Clientlayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
