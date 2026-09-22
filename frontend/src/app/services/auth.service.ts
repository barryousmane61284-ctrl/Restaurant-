// ============================================================================
// SERVICE D'AUTHENTIFICATION (AUTH.SERVICE.TS)
// ============================================================================
// À QUOI SERT CE SERVICE ?
// Il est responsable de tout ce qui concerne la connexion, la session et les rôles.
// C'est lui qui discute avec la route Express "/authentification".

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReponseConnexion, Utilisateur } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root' // Ce service est disponible partout dans l'application
})
export class AuthService {
  private http = inject(HttpClient); // Permet d'envoyer des requêtes réseau
  private router = inject(Router);     // Permet de changer de page
  private toastService = inject(ToastService);

  // Adresse complète du module d'authentification Express
  private apiUrl = `${environment.apiUrl}/authentification`;

  // --------------------------------------------------------------------------
  // 1. CONNEXION D'UN UTILISATEUR (ADMIN / SERVEUR / CAISSIER)
  // --------------------------------------------------------------------------
  // Envoie l'email et le mot de passe au backend Express (POST /authentification/connexion)
  // Si le backend valide, on enregistre le token et l'utilisateur dans le navigateur.
  connexion(identifiants: { email: string; password: string }): Observable<ReponseConnexion> {
    return this.http.post<ReponseConnexion>(`${this.apiUrl}/connexion`, identifiants).pipe(
      tap((reponse) => {
        // Sauvegarde dans le localStorage (mémoire du navigateur)
        localStorage.setItem('access_token', reponse.accessToken);
        localStorage.setItem('refresh_token', reponse.refreshToken);
        localStorage.setItem('utilisateur', JSON.stringify(reponse.utilisateur));
      })
    );
  }

  // --------------------------------------------------------------------------
  // 2. DÉCONNEXION PROPRE
  // --------------------------------------------------------------------------
  // Supprime toutes les données de session du navigateur et renvoie à la page /login
  deconnexion(): void {
    const user = this.getUtilisateurConnecte();
    const prenom = user?.prenom ? ` ${user.prenom}` : '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('utilisateur');
    this.router.navigate(['/login']);
    this.toastService.info(`Vous avez été déconnecté avec succès. À bientôt${prenom} !`, 'Déconnexion');
  }

  // --------------------------------------------------------------------------
  // 3. VÉRIFIER SI QUELQU'UN EST CONNECTÉ
  // --------------------------------------------------------------------------
  // Renvoie "true" si un jeton existe, "false" sinon
  estConnecte(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // --------------------------------------------------------------------------
  // 4. RÉCUPÉRER LES INFOS DE L'UTILISATEUR CONNECTÉ
  // --------------------------------------------------------------------------
  // Lit les données de l'utilisateur enregistrées dans le navigateur
  getUtilisateurConnecte(): Utilisateur | null {
    const userJson = localStorage.getItem('utilisateur');
    return userJson ? JSON.parse(userJson) : null;
  }

  // --------------------------------------------------------------------------
  // 5. VÉRIFIER SI L'UTILISATEUR EST UN ADMINISTRATEUR
  // --------------------------------------------------------------------------
  // Utile pour afficher ou cacher les boutons sensibles (suppression, création de plats)
  estAdmin(): boolean {
    const user = this.getUtilisateurConnecte();
    return user?.role === 'admin';
  }

  // --------------------------------------------------------------------------
  // 6. RÉCUPÉRER LE PROFIL DEPUIS LE SERVEUR
  // --------------------------------------------------------------------------
  // Appelle GET /authentification/moi pour obtenir les données fraîches
  getMonProfil(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/moi`);
  }
}
