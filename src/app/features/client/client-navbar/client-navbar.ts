import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/Auth';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-navbar.html',
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class ClientNavbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth'], { replaceUrl: true });
  }
}
