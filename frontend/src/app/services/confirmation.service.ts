import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmationOptions {
  titre?: string;
  message: string;
  texteConfirmer?: string;
  texteAnnuler?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmationInterne extends ConfirmationOptions {
  resolve: (valeur: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private demandeSubject = new Subject<ConfirmationInterne | null>();
  public demande$ = this.demandeSubject.asObservable();

  confirmer(options: ConfirmationOptions): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.demandeSubject.next({
        titre: options.titre || 'Confirmation',
        message: options.message,
        texteConfirmer: options.texteConfirmer || 'Confirmer',
        texteAnnuler: options.texteAnnuler || 'Annuler',
        type: options.type || 'danger',
        resolve: (valeur: boolean) => {
          observer.next(valeur);
          observer.complete();
          this.demandeSubject.next(null);
        }
      });
    });
  }
}
