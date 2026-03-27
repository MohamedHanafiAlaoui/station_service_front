import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pompe } from '../../../../../core/models/pompe';
@Component({
  selector: 'app-pompe-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pompe-table.component.html',
})
export class PompeTableComponent {
  @Input() pompes: Pompe[] = [];
  @Input() isLoading = false;
  @Output() viewDetails = new EventEmitter<Pompe>();
  @Output() edit = new EventEmitter<Pompe>();
  @Output() delete = new EventEmitter<number>();
  @Output() restore = new EventEmitter<number>();
  onViewDetails(pompe: Pompe) {
    this.viewDetails.emit(pompe);
  }
  onEdit(pompe: Pompe) {
    this.edit.emit(pompe);
  }
  onDelete(id: number | undefined) {
    if (id) this.delete.emit(id);
  }
  onRestore(id: number | undefined) {
    if (id) this.restore.emit(id);
  }
  getFuelBadgeClass(type: string): string {
    return type === 'ESSENCE' 
      ? 'bg-amber-100 text-amber-700 border-amber-200' 
      : 'bg-slate-100 text-slate-700 border-slate-200';
  }
}