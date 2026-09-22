// ============================================================================
// LE GARDE DE PORTE : AUTH GUARD
// ============================================================================
// À QUOI ÇA SERT ?
// C'est le vigile à l'entrée de vos pages privées (Plats, Commandes, Factures...).
// Si quelqu'un essaie d'ouvrir la page "/plats" directement dans son navigateur
// sans s'être d'abord connecté, ce fichier bloque l'entrée et l'envoie vers "/login".

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Étape 1 : On vérifie si un jeton de connexion existe dans le navigateur
  const token = localStorage.getItem('access_token');

  // Étape 2 : Si le token existe, la porte s'ouvre !
  if (token) {
    return true; // Accès autorisé
  }

  // Étape 3 : Si pas de token, on renvoie poliment vers la page de login
  router.navigate(['/login']);
  return false; // Accès bloqué
};
