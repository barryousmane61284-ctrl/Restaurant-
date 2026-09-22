// ============================================================================
// SERVICE DES FACTURES (FACTURE.SERVICE.TS)
// ============================================================================
// Permet de consulter l'historique des règlements et générer des factures.
// Communique avec la route Express "/facture".

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Facture } from '../models/facture.model';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/facture`;

  // Cache en mémoire vive pour les factures
  private facturesSubject = new BehaviorSubject<Facture[]>([]);
  public factures$ = this.facturesSubject.asObservable();
  public estCharge: boolean = false;

  getCacheFactures(): Facture[] {
    return this.facturesSubject.value;
  }

  // Récupérer la liste de toutes les factures (GET /facture)
  getFactures(page: number = 1, limit: number = 50, id_client?: string): Observable<any> {
    let url = `${this.apiUrl}/?page=${page}&limit=${limit}`;
    if (id_client) {
      url += `&id_client=${id_client}`;
    }
    return this.http.get<any>(url).pipe(
      tap((res) => {
        if (!id_client) {
          const list = res.factures || res.data || (Array.isArray(res) ? res : []);
          this.facturesSubject.next(list);
          this.estCharge = true;
        }
      })
    );
  }

  // Récupérer le reçu d'une facture précise (GET /facture/:id)
  getFactureParId(id: string): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }

  // Enregistrer une facture (POST /facture/creation)
  creerFacture(facture: any): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/creation`, facture);
  }

  // Supprimer une facture (DELETE /facture/:id)
  supprimerFacture(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
