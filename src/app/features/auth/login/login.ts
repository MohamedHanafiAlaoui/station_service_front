import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/Auth';
import Swal from 'sweetalert2';
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
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';
  showChangePassword = false;
  
  USERNAME_REGEX = /^[a-zA-Z0-9._-]{4,20}$/;
  PASSWORD_REGEX = /^[a-zA-Z0-9@#$%^&+=!]{8,30}$/;
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
        const errorStr = typeof msg === 'string' ? msg : JSON.stringify(msg);
        if (errorStr.toLowerCase().includes('401') || errorStr.toLowerCase().includes('unauthorized') || errorStr.toLowerCase().includes('bad credentials')) {
          this.error = "Nom d'utilisateur ou mot de passe incorrect.";
        } else {
          this.error = "Erreur de connexion serveur.";
        }
      },
    });
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    this.error = '';
    this.success = '';
  }

  changePassword() {
    if (!this.username || !this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.error = "Veuillez remplir tous les champs.";
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Les nouveaux mots de passe ne correspondent pas.";
      return;
    }
    if (!this.PASSWORD_REGEX.test(this.newPassword)) {
      this.error = "Nouveau mot de passe invalide (8+ caractères).";
      return;
    }

    this.error = '';
    const data = {
      username: this.username,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.auth.changePassword(data).subscribe({
      next: () => {
        this.success = "Mot de passe changé avec succès. Vous pouvez maintenant vous connecter.";
        this.showChangePassword = false;
        this.password = '';
      },
      error: (msg) => {
        this.error = msg;
      }
    });
  }

  onForgotPassword() {
    Swal.fire({
      title: 'Mot de passe oublié ?',
      text: "Veuillez contacter l'administrateur de la station pour réinitialiser vos identifiants.",
      icon: 'info',
      confirmButtonText: 'Compris',
      confirmButtonColor: '#3b82f6'
    });
  }
}