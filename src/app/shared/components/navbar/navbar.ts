import { Component, inject } from '@angular/core';
import {  AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/Auth';
import { ClientNavbar } from '../../../features/client/client-navbar/client-navbar';
import { EmployeNavbar } from '../../../features/employe/employe-navbar/employe-navbar';
import { AdminNavbar } from '../../../features/admin/admin-navbar/admin-navbar';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ AsyncPipe, ClientNavbar, EmployeNavbar, AdminNavbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private auth = inject(AuthService);
  role$ = this.auth.role$;
}
