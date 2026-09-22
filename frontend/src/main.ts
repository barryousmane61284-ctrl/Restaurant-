// ============================================================================
// POINT D'ENTRÉE PRINCIPAL D'ANGULAR (MAIN.TS)
// ============================================================================
// C'est le tout premier fichier exécuté par le navigateur quand l'application démarre.
// Son rôle est très simple : démarrer le composant principal (AppComponent)
// avec la configuration générale du projet (appConfig).

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// On démarre l'application Angular dans le navigateur
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Erreur au démarrage de l\'application Angular :', err));
