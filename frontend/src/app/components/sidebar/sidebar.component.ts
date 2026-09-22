// ============================================================================
// COMPOSANT : SIDEBAR (MENU LATÉRAL GAUCHE)
// ============================================================================
// Permet de naviguer d'un clic entre le Tableau de bord, les Plats,
// les Commandes et les Factures.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  authService = inject(AuthService);

  // Indique si la personne connectée est un administrateur
  get estAdmin() {
    return this.authService.estAdmin();
  }
}
