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
  .then(() => {
    // Enregistrement du Service Worker PWA pour le support hors-ligne
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('GourmetResto PWA : Service Worker actif'))
        .catch((err) => console.log('Service Worker non enregistré :', err));
    }
  })
  .catch((err) => console.error('Erreur au démarrage de l\'application Angular :', err));
