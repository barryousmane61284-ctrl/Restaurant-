// ============================================================================
// COMPOSANT MODALE : PROFIL ET SÉCURITÉ DE L'UTILISATEUR CONNECTÉ
// ============================================================================

import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Utilisateur } from '../../models/user.model';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit {
  @Output() fermer = new EventEmitter<void>();

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  // Onglet actif : 'infos' | 'securite'
  ongletActif: 'infos' | 'securite' = 'infos';

  // Utilisateur actuellement connecté
  utilisateur: Utilisateur | null = null;

  // Formulaire Informations personnelles
  formInfos = {
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  };

  // Formulaire Sécurité & Mot de passe
  formPassword = {
    ancienPassword: '',
    nouveauPassword: '',
    confirmPassword: ''
  };

  // Visibilité des mots de passe
  afficherAncienPassword = false;
  afficherNouveauPassword = false;
  afficherConfirmPassword = false;

  // Gestion de la photo de profil
  fichierPhoto: File | null = null;
  apercuPhoto: string | null = null;

  // Indicateurs de chargement
  envoiInfos = false;
  envoiPassword = false;

  ngOnInit(): void {
    this.chargerUtilisateur();
  }

  // Charge les données de l'utilisateur connecté
  chargerUtilisateur(): void {
    const user = this.authService.getUtilisateurConnecte();
    if (user) {
      this.utilisateur = user;
      this.formInfos = {
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || ''
      };

      if (user.image) {
        this.apercuPhoto = this.userService.getImageUrl(user.image);
      }
    }
  }

  // Sélection d'une nouvelle photo
  onFichierSelectionne(event: any): void {
    const fichier = event.target.files?.[0];
    if (fichier) {
      // Vérification du format (images uniquement)
      if (!fichier.type.match(/image\/*/)) {
        this.toastService.error('Seules les images sont acceptées (JPG, PNG, WebP).', 'Format invalide');
        return;
      }

      this.fichierPhoto = fichier;
      const reader = new FileReader();
      reader.onload = () => {
        this.apercuPhoto = reader.result as string;
      };
      reader.readAsDataURL(fichier);
    }
  }

  // Enregistrement des informations personnelles
  enregistrerInfos(): void {
    if (!this.utilisateur) return;

    if (!this.formInfos.prenom.trim() || !this.formInfos.nom.trim()) {
      this.toastService.warning('Le prénom et le nom sont requis.', 'Champs incomplets');
      return;
    }

    if (!this.formInfos.email.trim()) {
      this.toastService.warning('L\'adresse email est requise.', 'Champs incomplets');
      return;
    }

    this.envoiInfos = true;
    const userId = this.utilisateur.id || (this.utilisateur as any)._id;

    // Préparation des données (FormData si upload photo, JSON sinon)
    let payload: any;
    if (this.fichierPhoto) {
      const formData = new FormData();
      formData.append('prenom', this.formInfos.prenom.trim());
      formData.append('nom', this.formInfos.nom.trim());
      formData.append('email', this.formInfos.email.trim());
      formData.append('telephone', this.formInfos.telephone.trim());
      formData.append('image', this.fichierPhoto);
      payload = formData;
    } else {
      payload = {
        prenom: this.formInfos.prenom.trim(),
        nom: this.formInfos.nom.trim(),
        email: this.formInfos.email.trim(),
        telephone: this.formInfos.telephone.trim()
      };
    }

    this.userService.updateUser(userId, payload).subscribe({
      next: (utilisateurMisAJour) => {
        this.envoiInfos = false;
        this.authService.mettreAJourUtilisateurConnecte(utilisateurMisAJour);
        this.utilisateur = this.authService.getUtilisateurConnecte();
        this.toastService.success('Vos informations ont été mises à jour avec succès.', 'Profil mis à jour');
        this.fichierPhoto = null;
      },
      error: (err) => {
        this.envoiInfos = false;
        const msg = err.error?.message || 'Erreur lors de la mise à jour des informations.';
        this.toastService.error(msg, 'Erreur');
      }
    });
  }

  // Changement de mot de passe
  changerMotDePasse(): void {
    if (!this.utilisateur) return;

    const { ancienPassword, nouveauPassword, confirmPassword } = this.formPassword;

    if (!ancienPassword) {
      this.toastService.warning('Veuillez saisir votre mot de passe actuel.', 'Attention');
      return;
    }

    if (!nouveauPassword || nouveauPassword.length < 6) {
      this.toastService.warning('Le nouveau mot de passe doit comporter au moins 6 caractères.', 'Mot de passe trop court');
      return;
    }

    if (nouveauPassword !== confirmPassword) {
      this.toastService.warning('La confirmation ne correspond pas au nouveau mot de passe.', 'Erreur de saisie');
      return;
    }

    this.envoiPassword = true;
    const userId = this.utilisateur.id || (this.utilisateur as any)._id;

    this.userService.updatePassword(userId, { ancienPassword, nouveauPassword, confirmPassword }).subscribe({
      next: () => {
        this.envoiPassword = false;
        this.toastService.success('Votre mot de passe a été modifié avec succès.', 'Sécurité');
        this.formPassword = {
          ancienPassword: '',
          nouveauPassword: '',
          confirmPassword: ''
        };
      },
      error: (err) => {
        this.envoiPassword = false;
        const msg = err.error?.message || 'Impossible de modifier le mot de passe.';
        this.toastService.error(msg, 'Erreur');
      }
    });
  }

  // Ferme la modale
  fermerModale(): void {
    this.fermer.emit();
  }
}
