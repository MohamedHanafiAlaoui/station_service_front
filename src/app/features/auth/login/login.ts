import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  error = '';
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        const role = this.auth.getRole();
        if (role === 'ADMIN') this.router.navigate(['/admin']);
        else if (role === 'EMPLOYE') this.router.navigate(['/employe']);
        else if (role === 'CLIENT') this.router.navigate(['/client']);
      },
      error: () => {
        this.error = 'Invalid username or password';
      },
    });
  }
}
