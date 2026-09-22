// ============================================================================
// SERVICE DES CLIENTS (CLIENT.SERVICE.TS)
// ============================================================================
// Permet de lister, consulter et enregistrer les clients du restaurant.
// Communique avec la route Express "/client".

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/client`;

  // Cache en mémoire vive pour les clients
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  public clients$ = this.clientsSubject.asObservable();
  public estCharge: boolean = false;

  getCacheClients(): Client[] {
    return this.clientsSubject.value;
  }

  // 1. Récupérer la liste des clients enregistrés (GET /client)
  getClients(page: number = 1, limit: number = 50): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/?page=${page}&limit=${limit}`).pipe(
      tap((res) => {
        const list = res.clients || res.data || (Array.isArray(res) ? res : []);
        this.clientsSubject.next(list);
        this.estCharge = true;
      })
    );
  }

  // 2. Récupérer un client précis par son ID (GET /client/:id)
  getClientParId(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // 3. Créer un nouveau client (POST /client/creation)
  creerClient(client: any): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/creation`, client);
  }

  // 4. Modifier un client existant (PUT /client/:id)
  modifierClient(id: string, client: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, client);
  }

  // 5. Supprimer un client (DELETE /client/:id)
  supprimerClient(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
