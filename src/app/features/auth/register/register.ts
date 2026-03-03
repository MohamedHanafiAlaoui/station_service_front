import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/Auth';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../../core/models/register-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register(this.form).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès !';
        this.error = '';
        setTimeout(() => this.router.navigate(['/auth']), 1500);
      },
      error: (err) => {
        // إذا كان الخطأ من validationErrors
        if (err.error?.validationErrors) {
          const firstKey = Object.keys(err.error.validationErrors)[0];
          this.error = err.error.validationErrors[firstKey];
        }
        // إذا كان error.message موجود
        else if (err.error?.message) {
          this.error = err.error.message;
        }
        // fallback
        else {
          this.error = 'Erreur lors de la création du compte';
        }
      }
    });
  }
}
