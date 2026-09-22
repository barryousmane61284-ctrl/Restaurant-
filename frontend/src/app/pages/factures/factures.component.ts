// ============================================================================
// PAGE : FACTURATION ET ENCAISSEMENTS (FACTURES.COMPONENT.TS)
// ============================================================================
// Permet de :
// 1. Consulter l'historique complet de toutes les factures émises
// 2. Voir le moyen de paiement (Espèces, Carte, Mobile Money)
// 3. Ouvrir un reçu / ticket de caisse et l'imprimer pour le client

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactureService } from '../../services/facture.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Facture } from '../../models/facture.model';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css']
})
export class FacturesComponent implements OnInit {
  // Services
  private factureService = inject(FactureService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  // Données
  factures: Facture[] = [];
  chargement: boolean = true;
  messageErreur: string = '';

  // Facture cliquée pour afficher le reçu détaillé
  factureSelectionnee: Facture | null = null;

  ngOnInit(): void {
    this.chargerFactures();
  }

  // Étape 1 : Récupérer les factures depuis Express (GET /facture)
  chargerFactures(): void {
    const cache = this.factureService.getCacheFactures();
    if (cache && cache.length > 0) {
      this.factures = cache;
      this.chargement = false;
    } else {
      this.chargement = true;
    }
    this.messageErreur = '';

    this.factureService.getFactures().subscribe({
      next: (res) => {
        this.factures = res.factures || res.data || (Array.isArray(res) ? res : []);
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement factures:', err);
        this.chargement = false;
        this.messageErreur = err.error?.message || 'Erreur lors du chargement des factures.';
      }
    });
  }

  // Étape 2 : Afficher la modale avec le ticket de caisse
  voirDetails(facture: Facture): void {
    this.factureSelectionnee = facture;
  }

  // Étape 3 : Fermer la modale du reçu
  fermerDetails(): void {
    this.factureSelectionnee = null;
  }

  // Étape 4 : Lancer l'impression du ticket dans le navigateur
  imprimerFacture(): void {
    window.print();
  }

  // Étape 5 : Supprimer définitivement une facture (Admin uniquement)
  supprimerFacture(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette facture ?')) {
      this.factureService.supprimerFacture(id).subscribe({
        next: () => {
          this.factures = this.factures.filter(f => f._id !== id);
          if (this.factureSelectionnee?._id === id) {
            this.fermerDetails();
          }
          this.toastService.success('La facture a été supprimée avec succès !', 'Facture supprimée');
        },
        error: (err) => {
          const msg = err.error?.message || 'Erreur lors de la suppression de la facture.';
          this.toastService.error(msg, 'Erreur de suppression');
        }
      });
    }
  }
}
