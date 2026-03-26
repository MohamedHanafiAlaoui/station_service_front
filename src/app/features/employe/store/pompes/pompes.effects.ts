import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PompeService } from '../../../../core/services/pompe.service';
import { ToastService } from '../../../../core/services/toast.service';
import Swal from 'sweetalert2';
import * as PompesActions from './pompes.actions';
@Injectable()
export class PompesEffects {
  private actions$ = inject(Actions);
  private pompeService = inject(PompeService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  loadPompes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PompesActions.loadPompesByStation),
      mergeMap(action =>
        this.pompeService.getPompesByStation(action.stationId).pipe(
          map(pompes => PompesActions.loadPompesSuccess({ pompes })),
          catchError(error => {
            const errorMsg = error.error?.message || error.message || 'Impossible de charger les pompes';
            return of(PompesActions.loadPompesFailure({ error: errorMsg }));
          })
        )
      )
    )
  );
  addFuel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PompesActions.addFuel),
      mergeMap(action =>
        this.pompeService.addFuel(action.id, action.quantity).pipe(
          map(pompe => PompesActions.addFuelSuccess({ pompe })),
          catchError(error => {
            const errorMsg = error.error?.message || error.message || 'Échec de l\'ajout de carburant';
            return of(PompesActions.addFuelFailure({ error: errorMsg }));
          })
        )
      )
    )
  );
  addFuelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PompesActions.addFuelSuccess),
      tap(({ pompe }) => {
        Swal.fire({
          icon: 'success',
          title: 'Carburant Ajouté!',
          text: `Le carburant a été ajouté avec succès à la pompe P${pompe.codePompe}.`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#4f46e5'
        }).then(() => {
          this.router.navigate(['/employe/pompes']);
        });
      })
    ),
    { dispatch: false }
  );
  addFuelFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PompesActions.addFuelFailure),
      tap(({ error }) => this.toastService.error(error))
    ),
    { dispatch: false }
  );
}