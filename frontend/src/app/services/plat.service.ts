// ============================================================================
// SERVICE DES PLATS (PLAT.SERVICE.TS)
// ============================================================================
// À QUOI SERT CE SERVICE ?
// Il fait le lien avec la route Express "/plat".
// C'est lui qui va chercher la liste des plats, envoie un nouveau plat avec sa photo,
// ou demande au serveur de supprimer un plat.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Plat } from '../models/plat.model';

@Injectable({
  providedIn: 'root'
})
export class PlatService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/plat`;

  // Cache en mémoire vive pour affichage instantané à 0 ms
  private platsSubject = new BehaviorSubject<Plat[]>([]);
  public plats$ = this.platsSubject.asObservable();
  public estCharge: boolean = false;

  getCachePlats(): Plat[] {
    return this.platsSubject.value;
  }

  // 1. Récupérer la liste des plats (GET /plat?page=1&limit=50)
  getPlats(page: number = 1, limit: number = 50): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`).pipe(
      tap((res) => {
        const list = res.plats || res.data || (Array.isArray(res) ? res : []);
        this.platsSubject.next(list);
        this.estCharge = true;
      })
    );
  }

  // 2. Récupérer un plat précis par son identifiant (GET /plat/:id)
  getPlatParId(id: string): Observable<Plat> {
    return this.http.get<Plat>(`${this.apiUrl}/${id}`);
  }

  // 3. Ajouter un nouveau plat avec photo (POST /plat/creation)
  // On utilise FormData car il y a un fichier image géré par Multer côté backend
  creerPlat(donneesFormulaire: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/creation`, donneesFormulaire);
  }

  // 4. Modifier un plat existant (PUT /plat/:id)
  modifierPlat(id: string, donneesFormulaire: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, donneesFormulaire);
  }

  // 5. Supprimer un plat (DELETE /plat/:id)
  supprimerPlat(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  private defaultDishSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23fff2ed"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="%23ff6b35">🍽️</text><text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="600" fill="%2364748b">Plat du Restaurant</text></svg>';

  // 6. Fabriquer l'adresse web complète pour afficher une photo uploadée
  getImageUrl(cheminImage?: string): string {
    if (!cheminImage) {
      return this.defaultDishSvg;
    }
    if (cheminImage.startsWith('http') || cheminImage.startsWith('data:')) {
      return cheminImage;
    }
    if (cheminImage.startsWith('uploads/')) {
      return `${environment.apiUrl}/${cheminImage}`;
    }
    return `${environment.apiUrl}/uploads/plats/${cheminImage}`;
  }
}
