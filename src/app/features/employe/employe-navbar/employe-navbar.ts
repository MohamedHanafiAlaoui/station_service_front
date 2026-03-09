import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-employe-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employe-navbar.html',
  styleUrl: './employe-navbar.css',
})
export class EmployeNavbar {}
