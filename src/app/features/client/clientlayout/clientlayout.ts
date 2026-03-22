import { Component, inject, OnInit } from '@angular/core';
import { ClientNavbar } from "../client-navbar/client-navbar";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-clientlayout',
  standalone: true,
  imports: [ ClientNavbar, RouterModule, CommonModule],
  templateUrl: './clientlayout.html',
  styleUrl: './clientlayout.css',
})
export class Clientlayout implements OnInit {
  isSidebarOpen = false;
  private readonly router = inject(Router);
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.isSidebarOpen = false);
  }
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}