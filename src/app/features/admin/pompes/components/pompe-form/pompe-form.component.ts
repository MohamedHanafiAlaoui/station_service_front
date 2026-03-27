import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Station } from '../../../../../core/models/station';
import { Pompe } from '../../../../../core/models/pompe';
@Component({
  selector: 'app-pompe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pompe-form.component.html',
})
export class PompeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: Pompe | null = null;
  @Input() stations: Station[] = [];
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  pompeForm: FormGroup;
  constructor() {
    this.pompeForm = this.fb.group({
      typeCarburant: ['ESSENCE', [Validators.required]],
      capaciteMax: [1000, [Validators.required, Validators.min(1)]],
      niveauActuel: [0, [Validators.required, Validators.min(0)]],
      prixParLitre: [14.5, [Validators.required, Validators.min(0.01)]],
      enService: [true],
      stationId: ['', [Validators.required]]
    });
  }
  ngOnInit() {
    if (this.mode === 'edit' && this.initialData) {
      this.pompeForm.patchValue({
        typeCarburant: this.initialData.typeCarburant,
        capaciteMax: this.initialData.capaciteMax,
        niveauActuel: this.initialData.niveauActuel,
        prixParLitre: this.initialData.prixParLitre,
        enService: this.initialData.enService ?? true,
        stationId: this.initialData.stationId
      });
    }
  }
  onCancel() {
    this.cancel.emit();
  }
  onSubmit() {
    if (this.pompeForm.valid) {
      this.formSubmit.emit(this.pompeForm.getRawValue());
    }
  }
}