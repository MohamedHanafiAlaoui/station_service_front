import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="mb-4 w-full">
      <label *ngIf="label" class="block text-sm font-medium text-gray-700 mb-1">{{label}}</label>
      <input 
        [type]="type" 
        [placeholder]="placeholder"
        [disabled]="disabled"
        [(ngModel)]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border {{error ? 'border-red-500' : ''}}"
      >
      <p *ngIf="error" class="mt-1 text-sm text-red-600">{{error}}</p>
    </div>
  `
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error?: string;
  @Input() disabled: boolean = false;

  value: any = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }
}
