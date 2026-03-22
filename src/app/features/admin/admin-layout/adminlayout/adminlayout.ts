import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../../admin-header/admin-header.component';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-adminlayout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, AdminHeaderComponent, CommonModule],
  templateUrl: './adminlayout.html',
  styleUrl: './adminlayout.css'
})
export class Adminlayout implements OnInit {
  isSidebarOpen = false;
  private readonly router = inject(Router);
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isSidebarOpen = false;
    });
  }
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}