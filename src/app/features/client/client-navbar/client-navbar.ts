import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-client-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './client-navbar.html',
  styleUrl: './client-navbar.css',
})
export class ClientNavbar {}
