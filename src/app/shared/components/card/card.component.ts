import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 class="text-sm font-medium text-indigo-500">{{title}}</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{value}}</p>
      </div>
      <div *ngIf="subtitle" class="mt-4 text-xs text-indigo-400">
        {{subtitle}}
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
}
