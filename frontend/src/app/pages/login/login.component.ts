// ============================================================================
// PAGE : CONNEXION (LOGIN.COMPONENT.TS)
// ============================================================================
// Permet à un membre de l'équipe (Admin, Serveur, Caissier) de se connecter.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Outils nécessaires
  private authService = inject(AuthService); // Pour contacter Express
  private router = inject(Router);            // Pour changer de page après succès
  private toastService = inject(ToastService);

  // Variables liées aux champs du formulaire HTML
  email: string = '';
  motDePasse: string = '';

  // États du formulaire
  chargement: boolean = false;   // true quand la requête est en cours (affiche un spinner)
  messageErreur: string = '';    // Contient le message d'erreur si la connexion échoue
  motDePasseVisible: boolean = false; // true pour voir le mot de passe, false pour le masquer

  basculerVisibiliteMotDePasse(): void {
    this.motDePasseVisible = !this.motDePasseVisible;
  }

  // Méthode déclenchée quand on clique sur "Se connecter"
  seConnecter(): void {
    // Étape 1 : Vérifier que les champs ne sont pas vides
    if (!this.email || !this.motDePasse) {
      this.messageErreur = 'Veuillez saisir votre email et votre mot de passe.';
      this.toastService.warning(this.messageErreur, 'Champs manquants');
      return;
    }

    this.chargement = true;
    this.messageErreur = '';

    // Étape 2 : Envoyer l'email et le mot de passe au backend Express
    this.authService.connexion({
      email: this.email,
      password: this.motDePasse
    }).subscribe({
      next: (reponse) => {
        this.chargement = false;
        const prenom = reponse?.utilisateur?.prenom || '';
        const nom = reponse?.utilisateur?.nom || '';
        const role = reponse?.utilisateur?.role ? ` (${reponse.utilisateur.role})` : '';
        const identite = prenom ? `${prenom} ${nom}`.trim() : 'sur votre espace';
        this.toastService.success(`Bienvenue ${identite}${role} ! Heureux de vous revoir.`, 'Connexion réussie');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.chargement = false;
        this.messageErreur = err?.error?.message || 'Identifiants incorrects ou serveur indisponible.';
        this.toastService.error(this.messageErreur, 'Échec de connexion');
      }
    });
  }
}
