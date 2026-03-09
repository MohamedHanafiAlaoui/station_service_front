import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNavbar } from './client-navbar';

describe('ClientNavbar', () => {
  let component: ClientNavbar;
  let fixture: ComponentFixture<ClientNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
