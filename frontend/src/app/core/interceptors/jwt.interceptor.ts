// ============================================================================
// L'INTERCEPTEUR DE JETON DE SÉCURITÉ : JWT INTERCEPTOR
// ============================================================================
// À QUOI ÇA SERT ?
// Imaginez un gardien de péage : à chaque fois que votre frontend fait un appel
// vers votre backend Express (pour chercher un plat, créer une commande, etc.),
// cet intercepteur s'exécute automatiquement en coulisse.
//
// 1. Il va chercher le jeton de sécurité ("token") enregistré dans votre navigateur.
// 2. Si le jeton existe, il le colle dans l'en-tête de la lettre (Authorization: Bearer ...).
// 3. Si le jeton est trop vieux ou périmé (erreur 401), il renvoie automatiquement
//    l'utilisateur vers la page de connexion pour plus de sécurité.

import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  // Étape 1 : Récupération du jeton d'accès
  const token = localStorage.getItem('access_token');

  let requetePrete = req;
  if (token) {
    requetePrete = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Étape 2 : Envoi de la requête et interception des erreurs
  return next(requetePrete).pipe(
    catchError((erreur: HttpErrorResponse) => {
      const estRequeteAuth = req.url.includes('/authentification/connexion') ||
                             req.url.includes('/authentification/rafraichir');

      // Si erreur 401 et qu'il ne s'agit pas déjà d'un appel d'authentification
      if (erreur.status === 401 && !estRequeteAuth) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          // Tentative de renouvellement silencieux
          return http.post<{ accessToken: string }>(`${environment.apiUrl}/authentification/rafraichir`, {
            refreshToken
          }).pipe(
            switchMap((res) => {
              if (res?.accessToken) {
                localStorage.setItem('access_token', res.accessToken);
                // On rejoue la requête initiale avec le nouveau jeton
                const nouvelleRequete = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`
                  }
                });
                return next(nouvelleRequete);
              }
              // Si échec inattendu, on déconnecte
              deconnecter(router);
              return throwError(() => erreur);
            }),
            catchError((errRefresh) => {
              // Le refresh token est lui-même expiré -> déconnexion obligatoire
              deconnecter(router);
              return throwError(() => errRefresh);
            })
          );
        } else {
          deconnecter(router);
        }
      }

      return throwError(() => erreur);
    })
  );
};

function deconnecter(router: Router): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('utilisateur');
  router.navigate(['/login']);
}
