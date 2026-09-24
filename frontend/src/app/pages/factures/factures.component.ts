// ============================================================================
// PAGE : FACTURATION ET ENCAISSEMENTS (FACTURES.COMPONENT.TS)
// ============================================================================
// Permet de :
// 1. Consulter l'historique complet de toutes les factures émises
// 2. Voir le moyen de paiement (Espèces, Carte, Mobile Money)
// 3. Ouvrir un reçu / ticket de caisse et l'imprimer pour le client

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { Facture } from '../../models/facture.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  private confirmationService = inject(ConfirmationService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  // Données
  factures: Facture[] = [];
  chargement: boolean = true;
  messageErreur: string = '';

  // Facture cliquée pour afficher le reçu détaillé
  factureSelectionnee: Facture | null = null;

  ngOnInit(): void {
    this.chargerFactures();
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.verifierEtOuvrirFacture(params['id']);
      }
    });
  }

  private verifierEtOuvrirFacture(targetId: string): void {
    const facture = this.factures.find(f => f._id === targetId);
    if (facture) {
      this.voirDetails(facture);
    } else {
      this.factureService.getFactureParId(targetId).subscribe({
        next: (res: any) => {
          const f = res.facture || res.data || res;
          if (f && f._id) this.voirDetails(f);
        },
        error: () => {}
      });
    }
  }

  // Étape 1 : Récupérer les factures depuis Express (GET /facture)
  chargerFactures(): void {
    const cache = this.factureService.getCacheFactures();
    if (cache && cache.length > 0) {
      this.factures = cache;
      this.chargement = false;
      const targetId = this.route.snapshot.queryParams['id'];
      if (targetId) this.verifierEtOuvrirFacture(targetId);
    } else {
      this.chargement = true;
    }
    this.messageErreur = '';

    this.factureService.getFactures().subscribe({
      next: (res) => {
        this.factures = res.factures || res.data || (Array.isArray(res) ? res : []);
        this.chargement = false;
        const targetId = this.route.snapshot.queryParams['id'];
        if (targetId) this.verifierEtOuvrirFacture(targetId);
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

  // Étape 4bis : Générer et télécharger le reçu en PDF
  telechargerPdf(): void {
    if (!this.factureSelectionnee) return;

    const f = this.factureSelectionnee;
    const doc = new jsPDF();

    // En-tête Restaurant
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('GourmetResto', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Facture de vente & Reçu client', 14, 28);
    doc.text(`Facture N° : #${f._id}`, 14, 34);

    const dateStr = f.date_facture ? new Date(f.date_facture).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR');
    doc.text(`Date : ${dateStr}`, 14, 40);

    const clientNom = (f.id_client?.nom || f.id_client?.prenom)
      ? `${f.id_client?.nom || ''} ${f.id_client?.prenom || ''}`.trim()
      : 'Client de passage';
    doc.text(`Client : ${clientNom}`, 140, 28);

    const caissierNom = (f.id_user?.nom || f.id_user?.prenom)
      ? `${f.id_user?.nom || ''} ${f.id_user?.prenom || ''}`.trim()
      : 'Caisse';
    doc.text(`Caissier : ${caissierNom}`, 140, 34);
    doc.text(`Mode : ${f.mode_paiement || 'Espèces'}`, 140, 40);

    // Ligne de séparation
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 46, 196, 46);

    // Tableau des articles
    const plats = f.id_commande?.plat || [];
    const lignesTableau = plats.map((item: any) => [
      item.id_plat?.nom || 'Article',
      item.quantite?.toString() || '1',
      `${(item.prixunitaire || 0).toLocaleString()} GNF`,
      `${((item.quantite || 1) * (item.prixunitaire || 0)).toLocaleString()} GNF`
    ]);

    autoTable(doc, {
      startY: 52,
      head: [['Article / Plat', 'Quantité', 'Prix Unitaire', 'Total']],
      body: lignesTableau.length > 0 ? lignesTableau : [['Commande globale', '1', `${(f.montant_total || 0).toLocaleString()} GNF`, `${(f.montant_total || 0).toLocaleString()} GNF`]],
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 }
    });

    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 12 : 120;

    // Encadré Total
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(`TOTAL ENCAISSÉ : ${(f.montant_total || 0).toLocaleString()} GNF`, 14, finalY);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Merci pour votre visite ! À très bientôt chez GourmetResto.', 14, finalY + 12);

    doc.save(`facture_${f._id}.pdf`);
    this.toastService.success('Le fichier PDF de la facture a été généré !', 'Téléchargement réussi');
  }

  // Étape 5 : Supprimer définitivement une facture (Admin uniquement)
  supprimerFacture(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    this.confirmationService.confirmer({
      titre: 'Supprimer la facture',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement cette facture ?',
      texteConfirmer: 'Supprimer',
      texteAnnuler: 'Annuler',
      type: 'danger'
    }).subscribe(confirme => {
      if (confirme) {
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
    });
  }
}
