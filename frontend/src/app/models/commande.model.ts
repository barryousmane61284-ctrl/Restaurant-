// ============================================================================
// MODÈLE : COMMANDE
// ============================================================================
// Représente un ticket de commande passé dans le restaurant.

import { Plat } from './plat.model';
import { Client } from './client.model';
import { Utilisateur } from './user.model';

// Chaque ligne de la commande (un plat précis + sa quantité)
export interface LigneCommande {
  id_plat: any;             // Le plat commandé
  quantite: number;         // Combien d'assiettes ? (ex: 2)
  prixunitaire: number;     // Le prix au moment de la commande
}

// Les 4 statuts possibles dans le restaurant
export type StatutCommande = 'en_attente' | 'en_cours' | 'terminée' | 'annulée';

export interface Commande {
  _id: string;              // L'identifiant unique de la commande
  id_user: any;             // Le serveur ou caissier qui a saisi la commande
  id_client: any;           // Le client pour qui est la commande
  plat: LigneCommande[];    // La liste de tous les plats commandés
  date_commande: string;    // Date et heure de la commande
  total: number;            // Le montant total à payer
  status: StatutCommande;   // État : 'en_attente', 'en_cours', 'terminée', 'annulée'
  createdAt?: string;
}
