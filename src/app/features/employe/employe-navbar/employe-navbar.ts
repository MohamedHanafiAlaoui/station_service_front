import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/Auth';

@Component({
  selector: 'app-employe-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employe-navbar.html',
  styleUrl: './employe-navbar.css',
})
export class EmployeNavbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth'], { replaceUrl: true });
  }
}
