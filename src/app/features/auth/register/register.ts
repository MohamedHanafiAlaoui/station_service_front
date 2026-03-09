import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/Auth';
import { Router, RouterModule } from '@angular/router';
import { RegisterRequest } from '../../../core/models/register-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  form: RegisterRequest = {
    username: '',
    nom: '',
    prenom: '',
    password: '',
    role: 'CLIENT'
  };

  error = '';
  success = '';

  // FRONT-END REGEX (نفس backend)
  USERNAME_REGEX = /^[a-zA-Z0-9._-]{4,20}$/;
  NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

  constructor(private auth: AuthService, private router: Router) {}

  register() {

    // FRONT-END VALIDATION
    if (!this.form.username || !this.USERNAME_REGEX.test(this.form.username)) {
      this.error = "Nom d'utilisateur invalide (4–20 caractères, lettres/chiffres uniquement)";
      return;
    }

    if (!this.form.nom || !this.NAME_REGEX.test(this.form.nom)) {
      this.error = "Nom invalide (2–50 caractères)";
      return;
    }

    if (!this.form.prenom || !this.NAME_REGEX.test(this.form.prenom)) {
      this.error = "Prénom invalide (2–50 caractères)";
      return;
    }

    if (!this.form.password || !this.PASSWORD_REGEX.test(this.form.password)) {
      this.error = "Mot de passe invalide (8+ caractères, majuscule, minuscule, chiffre, symbole)";
      return;
    }

    this.error = '';

    this.auth.register(this.form).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès !';
        this.error = '';
        setTimeout(() => this.router.navigate(['/auth']), 1500);
      },
      error: (err) => {
        if (err.error?.validationErrors) {
          const firstKey = Object.keys(err.error.validationErrors)[0];
          this.error = err.error.validationErrors[firstKey];
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Erreur lors de la création du compte';
        }
      }
    });
  }
}
