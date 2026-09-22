// ============================================================================
// PAGE : GESTION DES CLIENTS (CLIENTS.COMPONENT.TS)
// ============================================================================
// Permet de :
// 1. Voir la liste de tous les clients enregistrés
// 2. Ajouter un nouveau client
// 3. Voir le détail d'un client : ses commandes et ses factures

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { CommandeService } from '../../services/commande.service';
import { FactureService } from '../../services/facture.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  private clientService = inject(ClientService);
  private commandeService = inject(CommandeService);
  private factureService = inject(FactureService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  // Liste de tous les clients
  clients: any[] = [];
  chargement: boolean = true;

  // Client sélectionné pour voir son détail
  clientSelectionne: any = null;
  commandesClient: any[] = [];
  facturesClient: any[] = [];
  chargementDetail: boolean = false;

  // Modale Client (Ajout / Modification)
  modalAjoutOuverte: boolean = false;
  modeEdition: boolean = false;
  idClientEnEdition: string | null = null;
  enregistrementEnCours: boolean = false;
  messageErreur: string = '';

  nouveauClient = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: ''
  };

  ngOnInit(): void {
    this.chargerClients();
  }

  // Charger tous les clients depuis le backend
  chargerClients(): void {
    const cache = this.clientService.getCacheClients();
    if (cache && cache.length > 0) {
      this.clients = cache;
      this.chargement = false;
    } else {
      this.chargement = true;
    }

    this.clientService.getClients().subscribe({
      next: (res) => {
        this.clients = res.clients || res.data || (Array.isArray(res) ? res : []);
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement clients:', err);
        this.chargement = false;
      }
    });
  }

  // Ouvrir la fiche détail d'un client
  voirDetailClient(client: any): void {
    this.clientSelectionne = client;
    this.commandesClient = [];
    this.facturesClient = [];
    this.chargementDetail = true;

    // Charger les commandes spécifiques à ce client
    this.commandeService.getCommandes(1, 50, client._id).subscribe({
      next: (res) => {
        this.commandesClient = res.commandes || res.data || (Array.isArray(res) ? res : []);
        this.chargementDetail = false;
      },
      error: () => { this.chargementDetail = false; }
    });

    // Charger les factures spécifiques à ce client
    this.factureService.getFactures(1, 50, client._id).subscribe({
      next: (res) => {
        this.facturesClient = res.factures || res.data || (Array.isArray(res) ? res : []);
      },
      error: () => {}
    });
  }

  // Fermer la fiche détail
  fermerDetail(): void {
    this.clientSelectionne = null;
    this.commandesClient = [];
    this.facturesClient = [];
  }

  // Ouvrir la modale d'ajout
  ouvrirModalAjout(): void {
    this.modeEdition = false;
    this.idClientEnEdition = null;
    this.nouveauClient = { nom: '', prenom: '', telephone: '', email: '', adresse: '' };
    this.messageErreur = '';
    this.modalAjoutOuverte = true;
  }

  // Ouvrir la modale de modification
  ouvrirModalEdition(client: any, event?: Event): void {
    if (event) event.stopPropagation();
    this.modeEdition = true;
    this.idClientEnEdition = client._id;
    this.nouveauClient = {
      nom: client.nom,
      prenom: client.prenom,
      telephone: client.telephone || '',
      email: client.email || '',
      adresse: client.adresse || ''
    };
    this.messageErreur = '';
    this.modalAjoutOuverte = true;
  }

  fermerModalAjout(): void {
    this.modalAjoutOuverte = false;
  }

  // Enregistrer (Créer ou Modifier) un client
  enregistrerClient(): void {
    if (!this.nouveauClient.nom || !this.nouveauClient.prenom) {
      this.messageErreur = 'Le nom et le prénom sont obligatoires.';
      return;
    }
    this.enregistrementEnCours = true;
    this.messageErreur = '';

    if (this.modeEdition && this.idClientEnEdition) {
      this.clientService.modifierClient(this.idClientEnEdition, this.nouveauClient).subscribe({
        next: () => {
          this.enregistrementEnCours = false;
          this.fermerModalAjout();
          this.chargerClients();
          if (this.clientSelectionne?._id === this.idClientEnEdition) {
            this.clientSelectionne = { ...this.clientSelectionne, ...this.nouveauClient };
          }
          this.toastService.success('Le client a été modifié avec succès !', 'Client mis à jour');
        },
        error: (err: any) => {
          this.enregistrementEnCours = false;
          this.messageErreur = err?.error?.message || 'Erreur lors de la modification du client.';
          this.toastService.error(this.messageErreur, 'Erreur de modification');
        }
      });
    } else {
      this.clientService.creerClient(this.nouveauClient).subscribe({
        next: () => {
          this.enregistrementEnCours = false;
          this.fermerModalAjout();
          this.chargerClients();
          this.toastService.success('Le client a été créé avec succès !', 'Client créé');
        },
        error: (err: any) => {
          this.enregistrementEnCours = false;
          this.messageErreur = err?.error?.message || 'Erreur lors de la création du client.';
          this.toastService.error(this.messageErreur, 'Erreur de création');
        }
      });
    }
  }

  // Supprimer un client
  supprimerClient(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm('Supprimer définitivement ce client ?')) {
      this.clientService.supprimerClient(id).subscribe({
        next: () => {
          this.clients = this.clients.filter(c => c._id !== id);
          if (this.clientSelectionne?._id === id) this.fermerDetail();
          this.toastService.success('Le client a été supprimé avec succès !', 'Client supprimé');
        },
        error: (err: any) => {
          const msg = err?.error?.message || 'Erreur lors de la suppression.';
          this.toastService.error(msg, 'Erreur de suppression');
        }
      });
    }
  }

  // Calculer le total des achats d'un client
  getTotalDepenses(): number {
    return this.facturesClient.reduce((sum, f) => sum + (f.montant_total || 0), 0);
  }

  getBadgeStatut(status: string): string {
    switch (status) {
      case 'en_attente': return 'badge-warning';
      case 'en_cours': return 'badge-info';
      case 'terminée': return 'badge-success';
      case 'annulée': return 'badge-danger';
      default: return 'badge-info';
    }
  }
}
