// ============================================================================
// COMPOSANT MAÎTRE DU PROJET : APP.COMPONENT.TS
// ============================================================================
// C'est le cadre de toute l'application.
// Il assemble la Navbar en haut, la Sidebar à gauche et affiche la page
// courante au centre dans le <router-outlet>.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    ToastComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // Vrai si on se trouve sur la page de connexion
  estSurPageLogin: boolean = false;

  constructor() {
    // On écoute la navigation pour savoir quand l'utilisateur est sur "/login"
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.estSurPageLogin = event.urlAfterRedirects.includes('/login') || event.url.includes('/login');
    });
  }

  // Affiche la Navbar et la Sidebar UNIQUEMENT quand l'utilisateur est connecté et hors de /login
  get afficherNavigation(): boolean {
    return this.authService.estConnecte() && !this.estSurPageLogin;
  }
}
