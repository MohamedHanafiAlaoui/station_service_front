import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/Auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  error = '';
  USERNAME_REGEX = /^[a-zA-Z0-9._-]{4,20}$/;
  PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  login() {
    if (!this.username || !this.USERNAME_REGEX.test(this.username)) {
      this.error = "Nom d'utilisateur invalide (4–20 caractères)";
      return;
    }
    if (!this.password || !this.PASSWORD_REGEX.test(this.password)) {
      this.error = "Mot de passe invalide (8+ caractères, majuscule, minuscule, chiffre, symbole)";
      return;
    }
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        const role = this.auth.getRole();
        if (role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
        else if (role === 'ROLE_EMPLOYE') this.router.navigate(['/employe']);
        else if (role === 'ROLE_CLIENT') this.router.navigate(['/client']);
      },
      error: (msg) => {
    this.error = typeof msg === 'string' ? msg : 'Erreur de connexion.';      },
    });
  }
}