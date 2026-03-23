import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-indigo-50/30">
          <tr>
            <th *ngFor="let col of columns" class="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
              {{col.header}}
            </th>
            <th *ngIf="actions.length > 0" class="px-6 py-3 text-right text-xs font-medium text-indigo-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let row of data" class="hover:bg-indigo-50/30 transition-colors">
            <td *ngFor="let col of columns" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <ng-container *ngIf="cellTemplate; else defaultCell">
                <ng-container *ngTemplateOutlet="cellTemplate; context: { field: col.field, value: row[col.field], row: row }"></ng-container>
              </ng-container>
              <ng-template #defaultCell>{{row[col.field]}}</ng-template>
            </td>
            <td *ngIf="actions.length > 0" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button *ngFor="let action of actions" (click)="onAction(action.id, row)" 
                class="px-3 py-1 bg-white border border-indigo-100 rounded-md text-{{action.color || 'indigo'}}-600 hover:bg-{{action.color || 'indigo'}}-50 transition-colors shadow-sm">
                {{action.label}}
              </button>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)" class="px-6 py-8 text-center text-sm text-indigo-500">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TableComponent {
  @Input() columns: { field: string; header: string }[] = [];
  @Input() data: any[] = [];
  @Input() actions: { id: string; label: string; color: string }[] = [];
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();
  @ContentChild('cellTemplate', { static: false }) cellTemplate?: TemplateRef<any>;
  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }
}