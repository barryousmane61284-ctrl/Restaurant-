// ============================================================================
// COMPOSANT : NAVBAR (BARRE DU HAUT AVEC RECHERCHE GLOBALE)
// ============================================================================

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RechercheService, ResultatRecherche } from '../../services/recherche.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProfileModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  rechercheService = inject(RechercheService);
  router = inject(Router);

  modalProfilOuverte = false;
  termeRecherche = '';
  resultats: ResultatRecherche | null = null;
  chargementRecherche = false;
  afficherResultats = false;

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.effectuerRecherche(query);
    });
  }

  get utilisateur() {
    return this.authService.getUtilisateurConnecte();
  }

  get urlPhoto(): string | null {
    const user = this.utilisateur;
    return user?.image ? this.userService.getImageUrl(user.image) : null;
  }

  onSearchInput(): void {
    if (this.termeRecherche.trim().length >= 2) {
      this.chargementRecherche = true;
      this.afficherResultats = true;
      this.searchSubject.next(this.termeRecherche);
    } else {
      this.resultats = null;
      this.chargementRecherche = false;
      this.afficherResultats = false;
    }
  }

  effectuerRecherche(query: string): void {
    if (!query || query.trim().length < 2) {
      this.resultats = null;
      this.chargementRecherche = false;
      return;
    }

    this.rechercheService.rechercherGlobale(query).subscribe({
      next: (res) => {
        this.resultats = res.data;
        this.chargementRecherche = false;
      },
      error: (err) => {
        console.error('Erreur recherche :', err);
        this.chargementRecherche = false;
      }
    });
  }

  effacerRecherche(): void {
    this.termeRecherche = '';
    this.resultats = null;
    this.afficherResultats = false;
  }

  masquerResultatsAvecDelai(): void {
    setTimeout(() => {
      this.afficherResultats = false;
    }, 200);
  }

  naviguerVers(route: string, id?: string): void {
    this.effacerRecherche();
    if (id) {
      this.router.navigate([route], { queryParams: { id } });
    } else {
      this.router.navigate([route]);
    }
  }

  estVide(res: ResultatRecherche | null): boolean {
    if (!res) return true;
    return (
      (!res.plats || res.plats.length === 0) &&
      (!res.clients || res.clients.length === 0) &&
      (!res.commandes || res.commandes.length === 0) &&
      (!res.factures || res.factures.length === 0) &&
      (!res.utilisateurs || res.utilisateurs.length === 0)
    );
  }

  ouvrirProfil(): void {
    this.modalProfilOuverte = true;
  }

  fermerProfil(): void {
    this.modalProfilOuverte = false;
  }

  deconnexion(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter du restaurant ?')) {
      this.authService.deconnexion();
    }
  }
}
