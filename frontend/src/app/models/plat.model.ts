// ============================================================================
// MODÈLE : PLAT DU RESTAURANT
// ============================================================================
// Décrit toutes les informations d'un plat présent sur la carte.

import { Categori } from './categori.model';

export interface Plat {
  _id: string;              // L'identifiant unique MongoDB du plat
  nom: string;              // Le nom du plat (ex: "Riz au Gras Poulet")
  description: string;      // Les détails (ingrédients, saveurs)
  prix: number;             // Le prix unitaire (en GNF / FCFA)
  disponible: boolean;      // Est-il disponible en cuisine ? (true = oui, false = rupture)
  categori: any;            // L'ID de la catégorie ou l'objet complet de la catégorie
  image?: string;           // Le chemin vers la photo uploadée sur le serveur
  createdAt?: string;       // Date d'enregistrement
  updatedAt?: string;
}

// Structure de réponse de la route Express /plat
export interface ReponsePlats {
  plats: Plat[];            // Liste des plats trouvés
  total?: number;           // Nombre total de plats existants
  page?: number;            // Page actuelle
  totalPages?: number;      // Nombre total de pages disponibles
}
