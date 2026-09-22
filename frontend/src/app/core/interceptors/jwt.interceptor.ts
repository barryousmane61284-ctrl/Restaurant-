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

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // L'outil Router permet de changer de page en cas de problème
  const router = inject(Router);

  // Étape 1 : On regarde dans le coffre du navigateur (localStorage) s'il y a un token
  const token = localStorage.getItem('access_token');

  // Étape 2 : Si un token est trouvé, on ajoute l'en-tête "Authorization: Bearer <token>"
  let requetePrete = req;
  if (token) {
    requetePrete = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Étape 3 : On laisse la requête partir vers Express et on écoute la réponse
  return next(requetePrete).pipe(
    catchError((erreur: HttpErrorResponse) => {
      // Si Express répond avec le code 401 (Accès refusé ou session expirée)
      if (erreur.status === 401) {
        // On nettoie la mémoire du navigateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('utilisateur');

        // On redirige immédiatement vers la page de login
        router.navigate(['/login']);
      }
      return throwError(() => erreur);
    })
  );
};
