// ============================================================================
// PAGE : GESTION DES COMMANDES (COMMANDES.COMPONENT.TS)
// ============================================================================
// Permet de :
// 1. Suivre les commandes en direct (en attente, en cuisine, terminées, annulées)
// 2. Changer le statut d'une commande (passer en cuisine, marquer prête, annuler)
// 3. Créer une nouvelle commande avec panier d'articles
// 4. Encaisser une commande et générer automatiquement la facture / reçu de caisse

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandeService } from '../../services/commande.service';
import { PlatService } from '../../services/plat.service';
import { ClientService } from '../../services/client.service';
import { FactureService } from '../../services/facture.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Commande, StatutCommande } from '../../models/commande.model';
import { Plat } from '../../models/plat.model';
import { Client } from '../../models/client.model';
import { Facture } from '../../models/facture.model';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {
  private commandeService = inject(CommandeService);
  private platService = inject(PlatService);
  private clientService = inject(ClientService);
  private factureService = inject(FactureService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  // Données
  commandes: Commande[] = [];
  commandesFiltrees: Commande[] = [];
  platsDisponibles: Plat[] = [];
  clients: Client[] = [];

  statutFiltre: string = 'tous';
  chargement: boolean = true;

  // Modale Nouvelle Commande
  modalOuverte: boolean = false;
  enregistrementEnCours: boolean = false;
  messageErreur: string = '';

  nouvelleCommande = {
    id_client: '',
    id_plat_selectionne: '',
    quantite: 1
  };
  articlesPanier: { plat: Plat; quantite: number; prixunitaire: number }[] = [];

  // Modale Encaissement / Facture
  modalEncaissementOuverte: boolean = false;
  commandeAEncaisser: Commande | null = null;
  modePaiementChoisi: string = 'Espèces';
  encaissementEnCours: boolean = false;
  messageErreurEncaissement: string = '';

  // Modale Ticket Reçu
  ticketFactureAffichee: any = null;

  ngOnInit(): void {
    this.chargerCommandes();
    this.chargerPlats();
    this.chargerClients();
  }

  chargerCommandes(): void {
    const cache = this.commandeService.getCacheCommandes();
    if (cache && cache.length > 0) {
      this.commandes = cache;
      this.filtrerParStatut(this.statutFiltre);
      this.chargement = false;
    } else {
      this.chargement = true;
    }

    this.commandeService.getCommandes(1, 30).subscribe({
      next: (res) => {
        this.commandes = res.commandes || res.data || (Array.isArray(res) ? res : []);
        this.filtrerParStatut(this.statutFiltre);
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement commandes:', err);
        this.chargement = false;
      }
    });
  }

  chargerPlats(): void {
    const cache = this.platService.getCachePlats();
    if (cache && cache.length > 0) {
      this.platsDisponibles = cache;
    }
    this.platService.getPlats(1, 100).subscribe({
      next: (res) => {
        this.platsDisponibles = res.plats || res.data || (Array.isArray(res) ? res : []);
      }
    });
  }

  chargerClients(): void {
    const cache = this.clientService.getCacheClients();
    if (cache && cache.length > 0) {
      this.clients = cache;
    }
    this.clientService.getClients(1, 100).subscribe({
      next: (res) => {
        this.clients = res.clients || res.data || (Array.isArray(res) ? res : []);
      }
    });
  }

  filtrerParStatut(statut: string): void {
    this.statutFiltre = statut;
    if (statut === 'tous') {
      this.commandesFiltrees = this.commandes;
    } else {
      this.commandesFiltrees = this.commandes.filter(c => c.status === statut);
    }
  }

  // Changement de statut de la commande (PUT /commande/:id)
  changerStatut(commandeId: string, nouveauStatut: StatutCommande): void {
    this.commandeService.mettreAJourStatut(commandeId, { status: nouveauStatut }).subscribe({
      next: () => {
        // Mise à jour locale instantanée
        const commande = this.commandes.find(c => c._id === commandeId);
        if (commande) commande.status = nouveauStatut;
        this.filtrerParStatut(this.statutFiltre);
        this.toastService.success(`Le statut de la commande a été changé en "${nouveauStatut}".`, 'Statut mis à jour');
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors du changement de statut.';
        this.toastService.error(msg, 'Erreur de mise à jour');
      }
    });
  }

  // Suppression d'une commande (DELETE /commande/:id)
  supprimerCommande(commandeId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette commande ?')) {
      this.commandeService.supprimerCommande(commandeId).subscribe({
        next: () => {
          this.commandes = this.commandes.filter(c => c._id !== commandeId);
          this.filtrerParStatut(this.statutFiltre);
          this.toastService.success('La commande a été supprimée avec succès !', 'Commande supprimée');
        },
        error: (err) => {
          const msg = err.error?.message || 'Erreur lors de la suppression de la commande.';
          this.toastService.error(msg, 'Erreur de suppression');
        }
      });
    }
  }

  // --- NOUVELLE COMMANDE ---
  ouvrirModal(): void {
    this.articlesPanier = [];
    this.nouvelleCommande = {
      id_client: this.clients.length > 0 ? this.clients[0]._id : '',
      id_plat_selectionne: this.platsDisponibles.length > 0 ? this.platsDisponibles[0]._id : '',
      quantite: 1
    };
    this.messageErreur = '';
    this.modalOuverte = true;
  }

  fermerModal(): void {
    this.modalOuverte = false;
  }

  ajouterAuPanier(): void {
    const plat = this.platsDisponibles.find(p => p._id === this.nouvelleCommande.id_plat_selectionne);
    if (!plat) return;

    const existant = this.articlesPanier.find(item => item.plat._id === plat._id);
    if (existant) {
      existant.quantite += this.nouvelleCommande.quantite;
    } else {
      this.articlesPanier.push({
        plat,
        quantite: this.nouvelleCommande.quantite,
        prixunitaire: plat.prix
      });
    }
    this.nouvelleCommande.quantite = 1;
  }

  retirerDuPanier(index: number): void {
    this.articlesPanier.splice(index, 1);
  }

  getTotalPanier(): number {
    return this.articlesPanier.reduce((sum, item) => sum + (item.quantite * item.prixunitaire), 0);
  }

  enregistrerCommande(): void {
    if (!this.nouvelleCommande.id_client) {
      this.messageErreur = 'Veuillez sélectionner un client.';
      return;
    }

    if (this.articlesPanier.length === 0) {
      this.messageErreur = 'Veuillez ajouter au moins un plat au panier.';
      return;
    }

    const utilisateurConnecte = this.authService.getUtilisateurConnecte();

    this.enregistrementEnCours = true;
    this.messageErreur = '';

    const payload = {
      id_user: utilisateurConnecte?.id,
      id_client: this.nouvelleCommande.id_client,
      plat: this.articlesPanier.map(item => ({
        id_plat: item.plat._id,
        quantite: item.quantite,
        prixunitaire: item.prixunitaire
      })),
      total: this.getTotalPanier(),
      status: 'en_attente'
    };

    this.commandeService.creerCommande(payload).subscribe({
      next: () => {
        this.enregistrementEnCours = false;
        this.fermerModal();
        this.chargerCommandes();
        this.toastService.success('La commande a été créée avec succès !', 'Commande créée');
      },
      error: (err) => {
        this.enregistrementEnCours = false;
        this.messageErreur = err.error?.message || 'Erreur lors de la création de la commande.';
        this.toastService.error(this.messageErreur, 'Erreur de création');
      }
    });
  }

  // --- ENCAISSEMENT ET FACTURATION ---
  ouvrirModalEncaissement(commande: Commande, event: Event): void {
    event.stopPropagation();
    this.commandeAEncaisser = commande;
    this.modePaiementChoisi = 'Espèces';
    this.messageErreurEncaissement = '';
    this.modalEncaissementOuverte = true;
  }

  fermerModalEncaissement(): void {
    this.modalEncaissementOuverte = false;
    this.commandeAEncaisser = null;
  }

  validerEncaissement(): void {
    if (!this.commandeAEncaisser) return;

    this.encaissementEnCours = true;
    this.messageErreurEncaissement = '';

    const user = this.authService.getUtilisateurConnecte();
    const clientId = typeof this.commandeAEncaisser.id_client === 'object'
      ? this.commandeAEncaisser.id_client._id
      : this.commandeAEncaisser.id_client;

    const payloadFacture = {
      id_commande: this.commandeAEncaisser._id,
      id_client: clientId,
      id_user: user?.id,
      montant_total: this.commandeAEncaisser.total,
      mode_paiement: this.modePaiementChoisi,
      statut: 'Payée'
    };

    this.factureService.creerFacture(payloadFacture).subscribe({
      next: (factureCreee) => {
        // Mettre la commande en terminée si ce n'est pas fait
        if (this.commandeAEncaisser && this.commandeAEncaisser.status !== 'terminée') {
          this.changerStatut(this.commandeAEncaisser._id, 'terminée');
        }
        this.encaissementEnCours = false;
        this.fermerModalEncaissement();
        // Afficher le reçu ticket de caisse
        this.ticketFactureAffichee = factureCreee;
        this.toastService.success('La facture a été émise et la commande encaissée avec succès !', 'Facture validée');
      },
      error: (err) => {
        this.encaissementEnCours = false;
        this.messageErreurEncaissement = err.error?.message || 'Erreur lors de la génération de la facture.';
        this.toastService.error(this.messageErreurEncaissement, 'Erreur de facturation');
      }
    });
  }

  fermerTicket(): void {
    this.ticketFactureAffichee = null;
    this.chargerCommandes();
  }

  imprimerTicket(): void {
    window.print();
  }

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
