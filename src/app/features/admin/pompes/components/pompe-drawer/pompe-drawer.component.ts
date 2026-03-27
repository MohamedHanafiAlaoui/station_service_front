import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pompe } from '../../../../../core/models/pompe';
@Component({
  selector: 'app-pompe-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pompe-drawer.component.html',
})
export class PompeDrawerComponent {
  @Input() isOpen = false;
  @Input() pompe: Pompe | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Pompe>();
  onClose() {
    this.close.emit();
  }
  onEdit() {
    if (this.pompe) this.edit.emit(this.pompe);
  }
}