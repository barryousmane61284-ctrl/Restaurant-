// ============================================================================
// PAGE : TABLEAU DE BORD (DASHBOARD.COMPONENT.TS)
// ============================================================================
// Récupère les données d'ensemble pour afficher les compteurs et statistiques :
// - Nombre total de plats au menu
// - Commandes en attente ou en cuisine
// - Chiffre d'affaires total
// - Tableau des dernières commandes passées

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';
import { PlatService } from '../../services/plat.service';
import { CommandeService } from '../../services/commande.service';
import { FactureService } from '../../services/facture.service';
import { AuthService } from '../../services/auth.service';
import { Commande } from '../../models/commande.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Services injectés
  private platService = inject(PlatService);
  private commandeService = inject(CommandeService);
  private factureService = inject(FactureService);
  authService = inject(AuthService);

  // Variables des compteurs
  totalPlats: number = 0;
  commandesEnAttente: number = 0;
  commandesEnCours: number = 0;
  commandesTerminees: number = 0;
  totalChiffreAffaires: number = 0;

  // Tableau des commandes récentes
  dernieresCommandes: Commande[] = [];
  chargement: boolean = true;

  ngOnInit(): void {
    this.chargerDonnees();
  }

  // Charge toutes les données en parallèle et ultra-rapidement avec forkJoin
  chargerDonnees(): void {
    this.chargement = true;

    forkJoin({
      platsRes: this.platService.getPlats(1, 100).pipe(catchError(err => of({ data: [], pagination: { total: 0 } }))),
      commandesRes: this.commandeService.getCommandes(1, 20).pipe(catchError(err => of({ data: [], pagination: { total: 0 } }))),
      facturesRes: this.factureService.getFactures().pipe(catchError(err => of({ data: [] })))
    }).subscribe({
      next: ({ platsRes, commandesRes, facturesRes }) => {
        // 1. Plats
        const plats = platsRes.data || platsRes.plats || (Array.isArray(platsRes) ? platsRes : []);
        this.totalPlats = platsRes.pagination?.total ?? plats.length;

        // 2. Commandes
        const commandes = commandesRes.data || commandesRes.commandes || (Array.isArray(commandesRes) ? commandesRes : []);
        this.dernieresCommandes = commandes;
        this.commandesEnAttente = commandes.filter((c: any) => c.status === 'en_attente').length;
        this.commandesEnCours = commandes.filter((c: any) => c.status === 'en_cours').length;
        this.commandesTerminees = commandes.filter((c: any) => c.status === 'terminée').length;

        // 3. Factures & Chiffre d'affaires
        const factures = facturesRes.data || facturesRes.factures || (Array.isArray(facturesRes) ? facturesRes : []);
        this.totalChiffreAffaires = factures.reduce((acc: number, f: any) => acc + (f.montant_total || 0), 0);

        this.chargement = false;
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  // Renvoie une classe CSS de couleur pour le statut
  getBadgeClass(status: string): string {
    switch (status) {
      case 'en_attente': return 'badge-warning';
      case 'en_cours': return 'badge-info';
      case 'terminée': return 'badge-success';
      case 'annulée': return 'badge-danger';
      default: return 'badge-info';
    }
  }
}
