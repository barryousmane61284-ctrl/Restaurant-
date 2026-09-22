import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  titre?: string;
  message: string;
  duree?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  // Notification de SUCCÈS (verte)
  success(message: string, titre: string = 'Opération réussie', duree: number = 3800): void {
    this.ajouterToast('success', message, titre, duree);
  }

  // Notification d'ERREUR (rouge)
  error(message: string, titre: string = 'Erreur', duree: number = 4500): void {
    this.ajouterToast('error', message, titre, duree);
  }

  // Notification d'INFORMATION (bleue)
  info(message: string, titre: string = 'Information', duree: number = 3800): void {
    this.ajouterToast('info', message, titre, duree);
  }

  // Notification d'ATTENTION (orange)
  warning(message: string, titre: string = 'Attention', duree: number = 4000): void {
    this.ajouterToast('warning', message, titre, duree);
  }

  // Ajout interne d'un toast avec auto-suppression après 'duree' ms
  private ajouterToast(type: 'success' | 'error' | 'info' | 'warning', message: string, titre?: string, duree: number = 3800): void {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const nouveauToast: ToastMessage = { id, type, titre, message, duree };

    const listeActuelle = this.toastsSubject.value;
    const listeMiseAJour = [...listeActuelle.slice(-3), nouveauToast];
    this.toastsSubject.next(listeMiseAJour);

    if (duree > 0) {
      setTimeout(() => {
        this.fermerToast(id);
      }, duree);
    }
  }

  // Fermer un toast par son identifiant
  fermerToast(id: string): void {
    const reste = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(reste);
  }

  // Vider tous les toasts
  vider(): void {
    this.toastsSubject.next([]);
  }
}
