// ============================================================================
// MODÈLE : FACTURE (REÇU DE CAISSE)
// ============================================================================
// Représente le paiement final d'une commande.

export interface Facture {
  _id: string;              // Numéro unique de la facture
  id_user: any;             // Caissier qui a encaissé
  id_commande: any;         // La commande payée
  id_client: any;           // Le client qui a réglé
  montant_total: number;    // Somme totale encaissée
  date_facture: string;     // Date et heure de l'encaissement
  statut: string;           // Statut (ex: "Payée")
  mode_paiement: string;    // Moyen de paiement (ex: "Espèces", "Orange Money", "Carte")
  createdAt?: string;
}
