// ============================================================================
// CONFIGURATION GLOBALE D'ANGULAR (APP.CONFIG.TS)
// ============================================================================
// Ce fichier prépare tous les outils essentiels dont notre application a besoin.
// Pensez-y comme à la boîte à outils principale du projet.

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Détecte et affiche les erreurs du navigateur pour faciliter le débogage
    provideBrowserGlobalErrorListeners(),

    // 2. Active le système de navigation (les routes pour changer de page)
    provideRouter(routes),

    // 3. Active le client HTTP pour contacter Express, et lui attache notre intercepteur JWT.
    // Grâce à ça, TOUTES les requêtes vers Express contiendront automatiquement le badge de connexion !
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
