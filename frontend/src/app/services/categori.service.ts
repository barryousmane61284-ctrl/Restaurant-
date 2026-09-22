// ============================================================================
// SERVICE DES CATÉGORIES (CATEGORI.SERVICE.TS)
// ============================================================================
// Gère les catégories de plats (Entrées, Desserts, Boissons...).
// Communique avec la route Express "/categori".

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categori } from '../models/categori.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categori`;

  // Cache en mémoire vive pour les catégories
  private categoriesSubject = new BehaviorSubject<Categori[]>([]);
  public categories$ = this.categoriesSubject.asObservable();
  public estCharge: boolean = false;

  getCacheCategories(): Categori[] {
    return this.categoriesSubject.value;
  }

  // 1. Obtenir toutes les catégories pour les filtres et les menus déroulants (GET /categori)
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`).pipe(
      tap((res) => {
        const list = res.categories || res.data || (Array.isArray(res) ? res : []);
        this.categoriesSubject.next(list);
        this.estCharge = true;
      })
    );
  }

  // 2. Créer une nouvelle catégorie (POST /categori/creation)
  creerCategorie(categorie: { nom: string; description: string }): Observable<Categori> {
    return this.http.post<Categori>(`${this.apiUrl}/creation`, categorie);
  }

  // 3. Supprimer une catégorie (DELETE /categori/:id)
  supprimerCategorie(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
