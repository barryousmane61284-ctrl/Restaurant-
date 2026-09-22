// ============================================================================
// PAGE : GESTION DE LA CARTE ET DES PLATS (PLATS.COMPONENT.TS)
// ============================================================================
// Permet de :
// 1. Lister tous les plats du menu avec leurs photos
// 2. Filtrer par catégories (Entrées, Plats, Desserts, Boissons)
// 3. Ajouter un nouveau plat ou modifier un plat existant (avec upload photo)
// 4. Ajouter une nouvelle catégorie de menu
// 5. Supprimer un plat en toute sécurité

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatService } from '../../services/plat.service';
import { CategoriService } from '../../services/categori.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Plat } from '../../models/plat.model';
import { Categori } from '../../models/categori.model';

@Component({
  selector: 'app-plats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plats.component.html',
  styleUrls: ['./plats.component.css']
})
export class PlatsComponent implements OnInit {
  platService = inject(PlatService);
  private categoriService = inject(CategoriService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  // Listes
  plats: Plat[] = [];
  platsFiltres: Plat[] = [];
  categories: Categori[] = [];

  // Filtre actif
  categorieSelectionnee: string = 'tous';
  chargement: boolean = true;

  // Modale Plat (Création / Modification)
  modalPlatOuverte: boolean = false;
  modeEdition: boolean = false;
  idPlatEnEdition: string | null = null;
  enregistrementEnCours: boolean = false;
  messageErreur: string = '';

  // Modale Détail & Agrandissement du Plat
  modalDetailOuverte: boolean = false;
  platSelectionne: Plat | null = null;

  // Formulaire de plat
  formPlat = {
    nom: '',
    description: '',
    prix: null as number | null,
    categori: '',
    disponible: true
  };
  fichierImage: File | null = null;

  // Modale Catégorie
  modalCategorieOuverte: boolean = false;
  enregistrementCatEnCours: boolean = false;
  messageErreurCat: string = '';
  nouvelleCategorie = {
    nom: '',
    description: ''
  };

  ngOnInit(): void {
    this.chargerCategories();
    this.chargerPlats();
  }

  chargerCategories(): void {
    const cache = this.categoriService.getCacheCategories();
    if (cache && cache.length > 0) {
      this.categories = cache;
    }
    this.categoriService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.categories || res.data || (Array.isArray(res) ? res : []);
      },
      error: (err) => console.error('Erreur chargement catégories:', err)
    });
  }

  chargerPlats(): void {
    const cache = this.platService.getCachePlats();
    if (cache && cache.length > 0) {
      this.plats = cache;
      this.filtrerPlats();
      this.chargement = false;
    } else {
      this.chargement = true;
    }

    this.platService.getPlats(1, 100).subscribe({
      next: (res) => {
        this.plats = res.plats || res.data || (Array.isArray(res) ? res : []);
        this.filtrerPlats();
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement plats:', err);
        this.chargement = false;
      }
    });
  }

  filtrerParCategorie(catId: string): void {
    this.categorieSelectionnee = catId;
    this.filtrerPlats();
  }

  private filtrerPlats(): void {
    if (this.categorieSelectionnee === 'tous') {
      this.platsFiltres = this.plats;
    } else {
      this.platsFiltres = this.plats.filter(plat => {
        const platCatId = plat.categori && typeof plat.categori === 'object' ? (plat.categori as any)._id : plat.categori;
        return platCatId === this.categorieSelectionnee;
      });
    }
  }

  // --- GESTION DES PLATS (AJOUT / MODIFICATION) ---
  ouvrirModalAjout(): void {
    this.modeEdition = false;
    this.idPlatEnEdition = null;
    this.formPlat = {
      nom: '',
      description: '',
      prix: null,
      categori: this.categories.length > 0 ? this.categories[0]._id : '',
      disponible: true
    };
    this.fichierImage = null;
    this.messageErreur = '';
    this.modalPlatOuverte = true;
  }

  // --- DÉTAIL / AGRANDISSEMENT D'UN PLAT ---
  ouvrirDetailPlat(plat: Plat): void {
    this.platSelectionne = plat;
    this.modalDetailOuverte = true;
  }

  fermerDetailPlat(): void {
    this.platSelectionne = null;
    this.modalDetailOuverte = false;
  }

  ouvrirModalEdition(plat: Plat, event?: Event): void {
    if (event) event.stopPropagation();
    if (this.modalDetailOuverte) {
      this.fermerDetailPlat();
    }
    this.modeEdition = true;
    this.idPlatEnEdition = plat._id;
    const catId = plat.categori && typeof plat.categori === 'object' ? (plat.categori as any)._id : plat.categori;
    this.formPlat = {
      nom: plat.nom,
      description: plat.description || '',
      prix: plat.prix,
      categori: catId || (this.categories.length > 0 ? this.categories[0]._id : ''),
      disponible: plat.disponible !== false
    };
    this.fichierImage = null;
    this.messageErreur = '';
    this.modalPlatOuverte = true;
  }

  fermerModalPlat(): void {
    this.modalPlatOuverte = false;
  }

  onFichierSelectionne(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fichierImage = file;
    }
  }

  enregistrerPlat(): void {
    if (!this.formPlat.nom || !this.formPlat.prix || !this.formPlat.categori) {
      this.messageErreur = 'Veuillez remplir au moins le nom, le prix et la catégorie.';
      return;
    }

    this.enregistrementEnCours = true;
    this.messageErreur = '';

    const formData = new FormData();
    formData.append('nom', this.formPlat.nom);
    formData.append('description', this.formPlat.description || '');
    formData.append('prix', String(this.formPlat.prix));
    formData.append('categori', this.formPlat.categori);
    formData.append('disponible', String(this.formPlat.disponible));

    if (this.fichierImage) {
      formData.append('image', this.fichierImage);
    }

    if (this.modeEdition && this.idPlatEnEdition) {
      // Modification du plat existant (PUT /plat/:id)
      this.platService.modifierPlat(this.idPlatEnEdition, formData).subscribe({
        next: () => {
          this.enregistrementEnCours = false;
          this.fermerModalPlat();
          this.chargerPlats();
          this.toastService.success('Le plat a été modifié avec succès !', 'Plat mis à jour');
        },
        error: (err) => {
          this.enregistrementEnCours = false;
          this.messageErreur = err.error?.message || 'Erreur lors de la modification du plat.';
          this.toastService.error(this.messageErreur, 'Erreur de modification');
        }
      });
    } else {
      // Création d'un nouveau plat (POST /plat/creation)
      this.platService.creerPlat(formData).subscribe({
        next: () => {
          this.enregistrementEnCours = false;
          this.fermerModalPlat();
          this.chargerPlats();
          this.toastService.success('Le plat a été créé avec succès !', 'Plat créé');
        },
        error: (err) => {
          this.enregistrementEnCours = false;
          this.messageErreur = err.error?.message || 'Erreur lors de la création du plat.';
          this.toastService.error(this.messageErreur, 'Erreur de création');
        }
      });
    }
  }

  supprimerPlat(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce plat ?')) {
      this.platService.supprimerPlat(id).subscribe({
        next: () => {
          // Mise à jour immédiate de la liste locale
          this.plats = this.plats.filter(p => p._id !== id);
          this.filtrerPlats();
          if (this.platSelectionne?._id === id) {
            this.fermerDetailPlat();
          }
          this.toastService.success('Le plat a été supprimé avec succès !', 'Plat supprimé');
        },
        error: (err: any) => {
          const msg = err?.error?.message || 'Erreur lors de la suppression.';
          this.toastService.error(msg, 'Erreur de suppression');
        }
      });
    }
  }

  // --- GESTION DES CATÉGORIES ---
  ouvrirModalCategorie(): void {
    this.nouvelleCategorie = { nom: '', description: '' };
    this.messageErreurCat = '';
    this.modalCategorieOuverte = true;
  }

  fermerModalCategorie(): void {
    this.modalCategorieOuverte = false;
  }

  enregistrerCategorie(): void {
    if (!this.nouvelleCategorie.nom) {
      this.messageErreurCat = 'Le nom de la catégorie est obligatoire.';
      return;
    }

    this.enregistrementCatEnCours = true;
    this.messageErreurCat = '';

    this.categoriService.creerCategorie(this.nouvelleCategorie).subscribe({
      next: () => {
        this.enregistrementCatEnCours = false;
        this.fermerModalCategorie();
        this.chargerCategories(); // Rechargement immédiat
        this.toastService.success('La catégorie a été créée avec succès !', 'Catégorie créée');
      },
      error: (err) => {
        this.enregistrementCatEnCours = false;
        this.messageErreurCat = err.error?.message || 'Erreur lors de la création de la catégorie.';
        this.toastService.error(this.messageErreurCat, 'Erreur');
      }
    });
  }

  getNomCategorie(cat: any): string {
    if (!cat) return 'Général';
    if (typeof cat === 'object' && cat.nom) return cat.nom;
    const trouvee = this.categories.find(c => c._id === cat);
    return trouvee ? trouvee.nom : 'Plat';
  }
}
