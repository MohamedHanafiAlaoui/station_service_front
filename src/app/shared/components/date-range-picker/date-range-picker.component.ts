import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 inline-flex">
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
        <input type="date" [(ngModel)]="startDate" (change)="onDateChange()" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">End Date</label>
        <input type="date" [(ngModel)]="endDate" (change)="onDateChange()" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border">
      </div>
    </div>
  `
})
export class DateRangePickerComponent {
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Output() dateChange = new EventEmitter<{start: string, end: string}>();

  onDateChange() {
    this.dateChange.emit({ start: this.startDate, end: this.endDate });
  }
}
