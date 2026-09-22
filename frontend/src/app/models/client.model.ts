// ==========================================================
// MODÈLE : CLIENT
// Rôle : Représente un client du restaurant.
// ==========================================================

export interface Client {
  _id: string;
  matricule: string;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  createdAt?: string;
}
