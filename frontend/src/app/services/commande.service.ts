// ============================================================================
// SERVICE DES COMMANDES (COMMANDE.SERVICE.TS)
// ============================================================================
// Gère la prise et le suivi des commandes dans le restaurant.
// Communique avec la route Express "/commande".

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Commande } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/commande`;

  // Cache en mémoire vive pour les commandes
  private commandesSubject = new BehaviorSubject<Commande[]>([]);
  public commandes$ = this.commandesSubject.asObservable();
  public estCharge: boolean = false;

  getCacheCommandes(): Commande[] {
    return this.commandesSubject.value;
  }

  // 1. Récupérer toutes les commandes passées (GET /commande)
  getCommandes(page: number = 1, limit: number = 50, id_client?: string): Observable<any> {
    let url = `${this.apiUrl}/?page=${page}&limit=${limit}`;
    if (id_client) {
      url += `&id_client=${id_client}`;
    }
    return this.http.get<any>(url).pipe(
      tap((res) => {
        if (!id_client) {
          const list = res.commandes || res.data || (Array.isArray(res) ? res : []);
          this.commandesSubject.next(list);
          this.estCharge = true;
        }
      })
    );
  }

  // 2. Récupérer une commande précise avec ses plats (GET /commande/:id)
  getCommandeParId(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  // 3. Enregistrer une nouvelle commande (POST /commande/creation)
  creerCommande(commande: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/creation`, commande);
  }

  // 4. Mettre à jour le statut d'une commande (ex: passer de "en_attente" à "en_cours")
  // Route : PUT /commande/:id
  mettreAJourStatut(id: string, donnees: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, donnees);
  }

  // 5. Supprimer ou annuler définitivement une commande (DELETE /commande/:id)
  supprimerCommande(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
