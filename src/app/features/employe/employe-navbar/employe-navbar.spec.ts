import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeNavbar } from './employe-navbar';

describe('EmployeNavbar', () => {
  let component: EmployeNavbar;
  let fixture: ComponentFixture<EmployeNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
