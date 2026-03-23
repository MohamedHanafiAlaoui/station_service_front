import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.allToasts(); track toast.id) {
        <div 
          class="pointer-events-auto flex items-center min-w-[300px] max-w-md p-4 rounded-xl shadow-2xl border animate-slide-in"
          [ngClass]="{
            'bg-white border-green-100 text-green-900': toast.type === 'success',
            'bg-white border-red-100 text-red-900': toast.type === 'error',
            'bg-white border-indigo-100 text-indigo-900': toast.type === 'info' || toast.type === 'warning'
          }"
        >
          <div class="mr-3 flex-shrink-0">
            @if (toast.type === 'success') {
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
            } @else if (toast.type === 'error') {
              <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
            } @else {
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            }
          </div>
          <div class="flex-grow font-medium text-sm">
            {{ toast.message }}
          </div>
          <button (click)="toastService.remove(toast.id)" class="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}