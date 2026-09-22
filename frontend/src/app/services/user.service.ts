// ============================================================================
// SERVICE DES UTILISATEURS / MEMBRES DE L'ÉQUIPE (USER.SERVICE.TS)
// ============================================================================
// Permet à l'Administrateur de :
// - Lister tous les employés du restaurant (Admin, Serveurs, Caissiers)
// - Créer un nouveau compte employé
// - Modifier ou supprimer un compte employé

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilisateur } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;

  // Cache en mémoire vive pour les utilisateurs
  private usersSubject = new BehaviorSubject<any[]>([]);
  public users$ = this.usersSubject.asObservable();
  public estCharge: boolean = false;

  getCacheUsers(): any[] {
    return this.usersSubject.value;
  }

  // 1. Récupérer la liste de tous les utilisateurs (GET /user?page=1&limit=50)
  getUsers(page: number = 1, limit: number = 50): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/?page=${page}&limit=${limit}`).pipe(
      tap((res) => {
        const list = res.data || res.users || (Array.isArray(res) ? res : []);
        this.usersSubject.next(list);
        this.estCharge = true;
      })
    );
  }

  // 2. Récupérer un utilisateur par son identifiant (GET /user/:id)
  getUserById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  // 3. Créer un nouvel utilisateur (POST /user)
  // Peut être envoyé en FormData (si photo) ou en JSON classique
  createUser(donnees: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, donnees);
  }

  // 4. Modifier un utilisateur existant (PUT /user/:id)
  updateUser(id: string, donnees: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, donnees);
  }

  // 5. Supprimer un utilisateur (DELETE /user/:id)
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // 6. Obtenir l'URL de la photo de profil d'un utilisateur
  getImageUrl(cheminImage?: string): string | null {
    if (!cheminImage) {
      return null;
    }
    if (cheminImage.startsWith('http') || cheminImage.startsWith('data:')) {
      return cheminImage;
    }
    if (cheminImage.startsWith('uploads/')) {
      return `${environment.apiUrl}/${cheminImage}`;
    }
    return `${environment.apiUrl}/uploads/users/${cheminImage}`;
  }
}
