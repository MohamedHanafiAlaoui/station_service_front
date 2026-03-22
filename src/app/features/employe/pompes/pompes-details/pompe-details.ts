import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { selectAllPompes, selectPompesLoading } from '../../store/pompes/pompes.selectors';
import { Pompe } from '../../../../core/models/pompe';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
@Component({
  selector: 'app-pompe-details',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, CardComponent],
  templateUrl: './pompe-details.html',
  styleUrl: './pompe-details.css'
})
export class PompeDetails implements OnInit {
  pompe$: Observable<Pompe | undefined>;
  loading$: Observable<boolean>;
  pompeId: number | null = null;
  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.loading$ = this.store.select(selectPompesLoading);
    this.pompe$ = new Observable<Pompe | undefined>(); 
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pompeId = +id;
      this.pompe$ = this.store.select(state => {
          const pompes = (state as any).pompes.pompes;
          return pompes.find((p: Pompe) => p.id === this.pompeId);
      });
    }
  }
  getFuelLevelPercentage(pompe: Pompe): number {
    if (!pompe.capaciteMax || pompe.capaciteMax === 0) return 0;
    return Math.round((pompe.niveauActuel / pompe.capaciteMax) * 100);
  }
}