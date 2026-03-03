import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  getMessage(error: HttpErrorResponse): string {

    // أخطاء validation من Spring Boot
    if (error.error?.validationErrors) {
      const firstKey = Object.keys(error.error.validationErrors)[0];
      return error.error.validationErrors[firstKey];
    }

    // message من backend
    if (error.error?.message) {
      return error.error.message;
    }

    // error من backend
    if (error.error?.error) {
      return error.error.error;
    }

    if (error.status === 401) {
      return 'Nom d’utilisateur ou mot de passe incorrect.';
    }

    if (error.status === 403) {
      return 'Accès refusé.';
    }

    if (error.status === 404) {
      return 'Ressource introuvable.';
    }

    if (error.status >= 500) {
      return 'Erreur interne du serveur.';
    }

    return 'Une erreur est survenue.';
  }
}
