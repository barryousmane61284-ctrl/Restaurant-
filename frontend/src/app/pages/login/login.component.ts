// ============================================================================
// PAGE : CONNEXION (LOGIN.COMPONENT.TS)
// ============================================================================
// Permet à un membre de l'équipe (Admin, Serveur, Caissier) de se connecter.
// Intègre un décompte en temps réel anti-brute-force (Rate Limiting).

import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
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
export class LoginComponent implements OnInit, OnDestroy {
  // Outils nécessaires
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Variables liées aux champs du formulaire HTML
  email: string = '';
  motDePasse: string = '';

  // États du formulaire
  chargement: boolean = false;
  messageErreur: string = '';
  messageDebloque: string = '';
  motDePasseVisible: boolean = false;

  // Gestion du décompte Rate-Limit
  secondesRestantes: number = 0;
  private minuteurId: any = null;

  ngOnInit(): void {
    // Vérifier si un blocage est toujours actif dans cette session
    const timestampFin = sessionStorage.getItem('login_bloque_jusqua');
    if (timestampFin) {
      const tempsRestantMs = parseInt(timestampFin, 10) - Date.now();
      if (tempsRestantMs > 0) {
        const secondes = Math.ceil(tempsRestantMs / 1000);
        this.demarrerMinuteur(secondes);
      } else {
        sessionStorage.removeItem('login_bloque_jusqua');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.minuteurId) {
      clearInterval(this.minuteurId);
      this.minuteurId = null;
    }
  }

  // Renvoie le temps restant sous forme mm:ss
  get tempsFormate(): string {
    const minutes = Math.floor(this.secondesRestantes / 60);
    const secondes = this.secondesRestantes % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`;
  }

  basculerVisibiliteMotDePasse(): void {
    this.motDePasseVisible = !this.motDePasseVisible;
  }

  // Lance le compte à rebours dynamique jusqu'à 0
  private demarrerMinuteur(secondes: number): void {
    if (this.minuteurId) {
      clearInterval(this.minuteurId);
    }

    const maintenant = Date.now();
    const finTimestamp = maintenant + (secondes * 1000);
    sessionStorage.setItem('login_bloque_jusqua', finTimestamp.toString());

    this.secondesRestantes = secondes;
    this.messageDebloque = '';
    this.cdr.detectChanges();

    this.minuteurId = setInterval(() => {
      const resteMs = finTimestamp - Date.now();
      if (resteMs <= 0) {
        clearInterval(this.minuteurId);
        this.minuteurId = null;
        this.secondesRestantes = 0;
        this.messageErreur = '';
        this.messageDebloque = 'Le délai est écoulé ! Vous pouvez maintenant retenter votre connexion.';
        sessionStorage.removeItem('login_bloque_jusqua');
        this.toastService.info('Le délai de sécurité est expiré. Vous pouvez vous reconnecter.', 'Accès rétabli');
        this.cdr.detectChanges();
      } else {
        this.secondesRestantes = Math.ceil(resteMs / 1000);
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  // Méthode déclenchée quand on clique sur "Se connecter"
  seConnecter(): void {
    if (this.secondesRestantes > 0) {
      this.toastService.warning(`Veuillez patienter encore ${this.tempsFormate} avant de réessayer.`, 'Compte temporairement bloqué');
      return;
    }

    // Étape 1 : Vérifier que les champs ne sont pas vides
    if (!this.email || !this.motDePasse) {
      this.messageErreur = 'Veuillez saisir votre email et votre mot de passe.';
      this.toastService.warning(this.messageErreur, 'Champs manquants');
      return;
    }

    this.chargement = true;
    this.messageErreur = '';
    this.messageDebloque = '';

    // Étape 2 : Envoyer l'email et le mot de passe au backend Express
    this.authService.connexion({
      email: this.email,
      password: this.motDePasse
    }).subscribe({
      next: (reponse) => {
        this.chargement = false;
        sessionStorage.removeItem('login_bloque_jusqua');
        const prenom = reponse?.utilisateur?.prenom || '';
        const nom = reponse?.utilisateur?.nom || '';
        const role = reponse?.utilisateur?.role ? ` (${reponse.utilisateur.role})` : '';
        const identite = prenom ? `${prenom} ${nom}`.trim() : 'sur votre espace';
        this.toastService.success(`Bienvenue ${identite}${role} ! Heureux de vous revoir.`, 'Connexion réussie');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.chargement = false;

        // Détection du blocage Rate Limiting (statut 429)
        if (err.status === 429) {
          const secondes = err.error?.secondesRestantes || 900; // 15 min par défaut
          this.messageErreur = err.error?.message || 'Trop de tentatives de connexion échouées.';
          this.demarrerMinuteur(secondes);
          this.toastService.error(`Accès suspendu. Veuillez patienter ${this.tempsFormate}.`, 'Protection de sécurité');
          return;
        }

        this.messageErreur = err?.error?.message || 'Identifiants incorrects ou serveur indisponible.';
        this.toastService.error(this.messageErreur, 'Échec de connexion');
      }
    });
  }
}
