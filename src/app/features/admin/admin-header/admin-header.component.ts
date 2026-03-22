import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
})
export class AdminHeaderComponent {
  @Input() isSidebarOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}