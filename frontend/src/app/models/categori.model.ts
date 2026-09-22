// ============================================================================
// MODÈLE : CATÉGORIE DU MENU
// ============================================================================
// Représente les familles de plats (ex : Entrées, Plats principaux, Boissons).

export interface Categori {
  _id: string;          // L'identifiant unique MongoDB de la catégorie
  nom: string;          // Le nom de la catégorie (ex: "Boissons Fraîches")
  description: string;  // Une petite description (ex: "Jus naturels, sodas")
  createdAt?: string;   // Date de création
  updatedAt?: string;   // Date de dernière mise à jour
}
