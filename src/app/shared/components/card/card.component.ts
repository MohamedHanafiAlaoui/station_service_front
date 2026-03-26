import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group flex flex-col justify-between border border-white/20"
         [ngClass]="glass ? 'bg-white/10 backdrop-blur-md' : 'bg-white shadow-sm border-slate-100'">
      <div class="flex flex-col">
        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] mb-2" 
            [ngClass]="glass ? 'text-indigo-300/80' : 'text-slate-500'">
          {{title}}
        </h3>
        <div class="flex items-baseline gap-1">
          <p class="text-3xl font-bold tracking-tight" 
             [ngClass]="glass ? 'text-white' : 'text-slate-900'">
            {{value}}
          </p>
        </div>
      </div>
      
      <div *ngIf="subtitle" class="mt-6 flex items-center gap-2">
        <div class="w-1.5 h-1.5 rounded-full" [ngClass]="glass ? 'bg-emerald-400' : 'bg-emerald-500'"></div>
        <p class="text-[11px] font-medium" 
           [ngClass]="glass ? 'text-indigo-200/60' : 'text-slate-400'">
          {{subtitle}}
        </p>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
  @Input() glass: boolean = false;
}