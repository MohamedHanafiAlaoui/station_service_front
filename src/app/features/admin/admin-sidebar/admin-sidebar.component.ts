import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/Auth';
@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  logout() {
    this.auth.logout();
    this.router.navigate(['/auth'], { replaceUrl: true });
  }
}