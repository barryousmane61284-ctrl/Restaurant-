// ============================================================================
// COMPOSANT : NAVBAR (BARRE DU HAUT)
// ============================================================================
// Affiche le logo du restaurant, le prénom et rôle de la personne connectée,
// et le bouton rouge pour se déconnecter.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // On injecte le service d'authentification pour lire l'utilisateur actuel
  authService = inject(AuthService);

  // Getter : Récupère automatiquement les données de l'utilisateur connecté
  get utilisateur() {
    return this.authService.getUtilisateurConnecte();
  }

  // Méthode appelée quand l'utilisateur clique sur le bouton "Déconnexion"
  deconnexion(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter du restaurant ?')) {
      this.authService.deconnexion();
    }
  }
}
