// ============================================================================
// PAGE : GESTION DE L'ÉQUIPE ET DES UTILISATEURS (UTILISATEURS.COMPONENT.TS)
// ============================================================================
// Réservé aux Administrateurs du restaurant.
// Permet de :
// 1. Lister tous les employés (Admins, Serveurs, Caissiers)
// 2. Créer un nouveau compte employé avec son rôle et son mot de passe
// 3. Supprimer un compte employé

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Utilisateur } from '../../models/user.model';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  utilisateurs: any[] = [];
  chargement: boolean = true;

  // Modale Membre (Ajout / Modification)
  modalOuverte: boolean = false;
  modeEdition: boolean = false;
  idUtilisateurEnEdition: string | null = null;
  enregistrementEnCours: boolean = false;
  messageErreur: string = '';
  motDePasseVisible: boolean = false;
  fichierImage: File | null = null;

  nouvelUtilisateur = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'serveur',
    password: ''
  };

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs(): void {
    const cache = this.userService.getCacheUsers();
    if (cache && cache.length > 0) {
      this.utilisateurs = cache;
      this.chargement = false;
    } else {
      this.chargement = true;
    }

    this.userService.getUsers(1, 100).subscribe({
      next: (res) => {
        this.utilisateurs = res.data || res.users || (Array.isArray(res) ? res : []);
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs:', err);
        this.chargement = false;
      }
    });
  }

  ouvrirModal(): void {
    this.modeEdition = false;
    this.idUtilisateurEnEdition = null;
    this.nouvelUtilisateur = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      role: 'serveur',
      password: ''
    };
    this.fichierImage = null;
    this.motDePasseVisible = false;
    this.messageErreur = '';
    this.modalOuverte = true;
  }

  ouvrirModalEdition(u: any, event?: Event): void {
    if (event) event.stopPropagation();
    this.modeEdition = true;
    this.idUtilisateurEnEdition = u._id || u.id;
    this.nouvelUtilisateur = {
      nom: u.nom || '',
      prenom: u.prenom || '',
      email: u.email || '',
      telephone: u.telephone || '',
      role: u.role || 'serveur',
      password: ''
    };
    this.fichierImage = null;
    this.motDePasseVisible = false;
    this.messageErreur = '';
    this.modalOuverte = true;
  }

  fermerModal(): void {
    this.modalOuverte = false;
  }

  basculerVisibiliteMotDePasse(): void {
    this.motDePasseVisible = !this.motDePasseVisible;
  }

  onFichierSelectionne(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fichierImage = file;
    }
  }

  enregistrerUtilisateur(): void {
    if (!this.nouvelUtilisateur.nom || !this.nouvelUtilisateur.prenom || !this.nouvelUtilisateur.email) {
      this.messageErreur = 'Veuillez remplir le nom, le prénom et l\'email.';
      return;
    }

    if (!this.modeEdition && !this.nouvelUtilisateur.password) {
      this.messageErreur = 'Veuillez renseigner un mot de passe pour la création.';
      return;
    }

    this.enregistrementEnCours = true;
    this.messageErreur = '';

    const formData = new FormData();
    formData.append('nom', this.nouvelUtilisateur.nom);
    formData.append('prenom', this.nouvelUtilisateur.prenom);
    formData.append('email', this.nouvelUtilisateur.email);
    formData.append('telephone', this.nouvelUtilisateur.telephone || '');
    formData.append('role', this.nouvelUtilisateur.role);

    if (this.nouvelUtilisateur.password) {
      formData.append('password', this.nouvelUtilisateur.password);
    }

    if (this.fichierImage) {
      formData.append('image', this.fichierImage);
    }

    if (this.modeEdition && this.idUtilisateurEnEdition) {
      this.userService.updateUser(this.idUtilisateurEnEdition, formData).subscribe({
        next: () => {
          this.enregistrementEnCours = false;
          this.fermerModal();
          this.chargerUtilisateurs();
          this.toastService.success('Le compte employé a été modifié avec succès !', 'Employé mis à jour');
        },
        error: (err: any) => {
          this.enregistrementEnCours = false;
          this.messageErreur = err?.error?.message || 'Erreur lors de la modification du compte.';
          this.toastService.error(this.messageErreur, 'Erreur de modification');
        }
      });
    } else {
      this.userService.createUser(formData).subscribe({
        next: () => {
          this.enregistrementEnCours = false;
          this.fermerModal();
          this.chargerUtilisateurs();
          this.toastService.success('Le compte employé a été créé avec succès !', 'Employé créé');
        },
        error: (err: any) => {
          this.enregistrementEnCours = false;
          this.messageErreur = err?.error?.message || 'Erreur lors de la création du compte.';
          this.toastService.error(this.messageErreur, 'Erreur de création');
        }
      });
    }
  }

  supprimerUtilisateur(id: string, userEmail: string): void {
    const userConnecte = this.authService.getUtilisateurConnecte();
    if (userConnecte?.email === userEmail) {
      this.toastService.warning('Vous ne pouvez pas supprimer votre propre compte connecté !', 'Action impossible');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de cet employé ?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.utilisateurs = this.utilisateurs.filter(u => (u._id || u.id) !== id);
          this.toastService.success('Le compte employé a été supprimé avec succès !', 'Employé supprimé');
        },
        error: (err: any) => {
          const msg = err?.error?.message || 'Erreur lors de la suppression.';
          this.toastService.error(msg, 'Erreur de suppression');
        }
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin': return 'badge-danger';
      case 'serveur': return 'badge-info';
      case 'caissier': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}
