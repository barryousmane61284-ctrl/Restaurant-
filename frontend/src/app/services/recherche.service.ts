import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResultatRecherche {
  plats: any[];
  clients: any[];
  commandes: any[];
  factures: any[];
  utilisateurs: any[];
}

export interface RechercheResponse {
  message: string;
  data: ResultatRecherche;
}

@Injectable({
  providedIn: 'root'
})
export class RechercheService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/recherche`;

  rechercherGlobale(q: string): Observable<RechercheResponse> {
    return this.http.get<RechercheResponse>(`${this.apiUrl}?q=${encodeURIComponent(q)}`);
  }
}
