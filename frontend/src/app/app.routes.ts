// ============================================================================
// LE ROUTEUR : GESTION DES PAGES ET DES ADRESSES URL (APP.ROUTES.TS)
// ============================================================================
// Ici, on définit quelle page afficher selon l'adresse tapée dans la barre du navigateur.
// On protège aussi les pages privées avec "authGuard".

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlatsComponent } from './pages/plats/plats.component';
import { CommandesComponent } from './pages/commandes/commandes.component';
import { FacturesComponent } from './pages/factures/factures.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // -------------------------------------------------------------
  // 1. PAGE DE CONNEXION : Accessible à tout le monde
  // -------------------------------------------------------------
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Connexion - Restaurant'
  },

  // -------------------------------------------------------------
  // 2. TABLEAU DE BORD : Protégé par authGuard (Connexion obligatoire)
  // -------------------------------------------------------------
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard],
    title: 'Tableau de bord - Restaurant'
  },

  // -------------------------------------------------------------
  // 3. GESTION DE LA CARTE ET DES PLATS : Protégé par authGuard
  // -------------------------------------------------------------
  { 
    path: 'plats', 
    component: PlatsComponent, 
    canActivate: [authGuard],
    title: 'Carte des Plats - Restaurant'
  },

  // -------------------------------------------------------------
  // 4. GESTION DES COMMANDES : Protégé par authGuard
  // -------------------------------------------------------------
  { 
    path: 'commandes', 
    component: CommandesComponent, 
    canActivate: [authGuard],
    title: 'Suivi des Commandes - Restaurant'
  },

  // -------------------------------------------------------------
  // 5. GESTION DES FACTURES : Protégé par authGuard
  // -------------------------------------------------------------
  { 
    path: 'factures', 
    component: FacturesComponent, 
    canActivate: [authGuard],
    title: 'Factures & Règlements - Restaurant'
  },

  // -------------------------------------------------------------
  // 6. GESTION DES CLIENTS : Protégé par authGuard
  // -------------------------------------------------------------
  { 
    path: 'clients', 
    component: ClientsComponent, 
    canActivate: [authGuard],
    title: 'Clients & Fidélité - Restaurant'
  },

  // -------------------------------------------------------------
  // 7. GESTION DE L\'ÉQUIPE (UTILISATEURS) : Protégé par authGuard
  // -------------------------------------------------------------
  { 
    path: 'utilisateurs', 
    component: UtilisateursComponent, 
    canActivate: [authGuard],
    title: 'Équipe & Utilisateurs - Restaurant'
  },

  // -------------------------------------------------------------
  // 6. REDIRECTION PAR DÉFAUT :
  // Si l'utilisateur arrive sur "/", on le redirige vers le tableau de bord
  // (qui lui-même vérifiera s'il est connecté ou l'enverra au login).
  // -------------------------------------------------------------
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Si l'adresse tapée n'existe pas, on renvoie vers le dashboard
  { path: '**', redirectTo: '/dashboard' }
];
