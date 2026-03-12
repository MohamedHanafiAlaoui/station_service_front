import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGaugeHigh,
  faClockRotateLeft,
  faWallet,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/Auth';

@Component({
  selector: 'app-client-navbar',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './client-navbar.html',
  styleUrl: './client-navbar.css',
})
export class ClientNavbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);


  isMenuOpen = false;

  username = this.auth.getUsername(); 


  readonly links = [
    {
      label: 'Dashboard',
      path: '/client',
      icon: faGaugeHigh,
    },
    {
      label: 'Historique',
      path: '/client/historique',
      icon: faClockRotateLeft,
    },
    {
      label: 'Solde',
      path: '/client/solde',
      icon: faWallet,
    },
    {
      label: 'Profil',
      path: '/client/profil',
      icon: faUser,
    },
  ] as const;

  protected readonly faGaugeHigh = faGaugeHigh;
  protected readonly faClockRotateLeft = faClockRotateLeft;
  protected readonly faWallet = faWallet;
  protected readonly faUser = faUser;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth'], { replaceUrl: true });
  }
}
