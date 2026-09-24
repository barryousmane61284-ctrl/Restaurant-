// ============================================================================
// PAGE : TABLEAU DE BORD (DASHBOARD.COMPONENT.TS)
// ============================================================================
// Récupère les données d'ensemble pour afficher les compteurs et statistiques :
// - Nombre total de plats au menu
// - Commandes en attente ou en cuisine
// - Chiffre d'affaires total
// - Tableau des dernières commandes passées
// - Graphiques interactifs (Chart.js) : Répartition des statuts & Chiffre d'affaires

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { PlatService } from '../../services/plat.service';
import { CommandeService } from '../../services/commande.service';
import { FactureService } from '../../services/facture.service';
import { AuthService } from '../../services/auth.service';
import { Commande } from '../../models/commande.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('statutChartCanvas') statutChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ventesChartCanvas') ventesChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Services injectés
  private platService = inject(PlatService);
  private commandeService = inject(CommandeService);
  private factureService = inject(FactureService);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  // Variables des compteurs
  totalPlats: number = 0;
  commandesEnAttente: number = 0;
  commandesEnCours: number = 0;
  commandesTerminees: number = 0;
  commandesAnnulees: number = 0;
  totalChiffreAffaires: number = 0;

  // Instances Chart.js
  private chartStatut: Chart | null = null;
  private chartVentes: Chart | null = null;

  // Tableau des commandes récentes
  dernieresCommandes: Commande[] = [];
  chargement: boolean = true;

  ngOnInit(): void {
    this.chargerDonnees();
  }

  ngOnDestroy(): void {
    this.detruireGraphiques();
  }

  private detruireGraphiques(): void {
    if (this.chartStatut) {
      this.chartStatut.destroy();
      this.chartStatut = null;
    }
    if (this.chartVentes) {
      this.chartVentes.destroy();
      this.chartVentes = null;
    }
  }

  // Charge toutes les données en parallèle et ultra-rapidement avec forkJoin
  chargerDonnees(): void {
    this.chargement = true;

    forkJoin({
      platsRes: this.platService.getPlats(1, 100).pipe(catchError(() => of({ data: [], pagination: { total: 0 } }))),
      commandesRes: this.commandeService.getCommandes(1, 50).pipe(catchError(() => of({ data: [], pagination: { total: 0 } }))),
      facturesRes: this.factureService.getFactures().pipe(catchError(() => of({ data: [] })))
    }).subscribe({
      next: ({ platsRes, commandesRes, facturesRes }) => {
        // 1. Plats
        const plats = platsRes.data || platsRes.plats || (Array.isArray(platsRes) ? platsRes : []);
        this.totalPlats = platsRes.pagination?.total ?? plats.length;

        // 2. Commandes
        const commandes = commandesRes.data || commandesRes.commandes || (Array.isArray(commandesRes) ? commandesRes : []);
        this.dernieresCommandes = commandes.slice(0, 10);
        this.commandesEnAttente = commandes.filter((c: any) => c.status === 'en_attente').length;
        this.commandesEnCours = commandes.filter((c: any) => c.status === 'en_cours').length;
        this.commandesTerminees = commandes.filter((c: any) => c.status === 'terminée').length;
        this.commandesAnnulees = commandes.filter((c: any) => c.status === 'annulée').length;

        // 3. Factures & Chiffre d'affaires
        const factures = facturesRes.data || facturesRes.factures || (Array.isArray(facturesRes) ? facturesRes : []);
        this.totalChiffreAffaires = factures.reduce((acc: number, f: any) => acc + (f.montant_total || 0), 0);

        this.chargement = false;
        this.cdr.detectChanges();

        // Rendu immédiat et sécurisé des graphiques
        setTimeout(() => {
          this.initialiserGraphiques(factures);
        }, 50);
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  private initialiserGraphiques(factures: any[]): void {
    this.detruireGraphiques();

    const totalCommandes = this.commandesEnAttente + this.commandesEnCours + this.commandesTerminees + this.commandesAnnulees;

    // 1. Graphique Donut : Répartition des statuts de commande
    if (this.statutChartCanvas?.nativeElement) {
      const ctxStatut = this.statutChartCanvas.nativeElement.getContext('2d');
      if (ctxStatut) {
        if (totalCommandes === 0) {
          // Affichage neutre si aucune commande n'existe encore
          this.chartStatut = new Chart(ctxStatut, {
            type: 'doughnut',
            data: {
              labels: ['Aucune commande enregistrée'],
              datasets: [{
                data: [1],
                backgroundColor: ['#e2e8f0'],
                borderWidth: 2,
                borderColor: '#cbd5e1'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { boxWidth: 12, padding: 15 }
                },
                tooltip: {
                  callbacks: {
                    label: () => ' Passez votre première commande pour voir les statuts'
                  }
                }
              }
            }
          });
        } else {
          this.chartStatut = new Chart(ctxStatut, {
            type: 'doughnut',
            data: {
              labels: ['En attente', 'En cuisine', 'Terminées', 'Annulées'],
              datasets: [{
                data: [
                  this.commandesEnAttente,
                  this.commandesEnCours,
                  this.commandesTerminees,
                  this.commandesAnnulees
                ],
                backgroundColor: ['#f59e0b', '#06b6d4', '#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { boxWidth: 12, padding: 15, font: { family: 'inherit', size: 12 } }
                }
              }
            }
          });
        }
      }
    }

    // 2. Graphique Barres : Chiffre d'affaires par tranche de factures
    if (this.ventesChartCanvas?.nativeElement) {
      const ctxVentes = this.ventesChartCanvas.nativeElement.getContext('2d');
      if (ctxVentes) {
        const dernieresFactures = [...factures].slice(-7);
        const hasFactures = dernieresFactures.length > 0;

        const labels = hasFactures
          ? dernieresFactures.map((f, i) => f.date_facture ? new Date(f.date_facture).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : `Fac #${i+1}`)
          : ['Aujourd\'hui'];

        const montants = hasFactures
          ? dernieresFactures.map(f => f.montant_total || 0)
          : [this.totalChiffreAffaires || 0];

        this.chartVentes = new Chart(ctxVentes, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Montant encaissé (GNF)',
              data: montants,
              backgroundColor: hasFactures ? 'rgba(79, 70, 229, 0.85)' : 'rgba(148, 163, 184, 0.5)',
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => ` ${Number(context.raw).toLocaleString()} GNF`
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `${Number(value).toLocaleString()} GNF`
                },
                grid: { color: 'rgba(226, 232, 240, 0.6)' }
              },
              x: {
                grid: { display: false }
              }
            }
          }
        });
      }
    }
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
