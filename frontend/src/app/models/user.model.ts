// ============================================================================
// MODÈLE : UTILISATEUR (USER)
// ============================================================================
// Ce fichier décrit à quoi ressemble un compte membre du restaurant.
// TypeScript s'en sert pour vérifier qu'on n'oublie aucun champ important.

export interface Utilisateur {
  id: string;             // L'identifiant unique de la base de données MongoDB
  _id?: string;
  nom: string;            // Le nom de famille
  prenom: string;         // Le prénom
  email: string;          // L'adresse email utilisée pour se connecter
  telephone?: string;     // Le numéro de téléphone (optionnel grâce au ?)
  role: 'admin' | 'serveur' | 'caissier'; // Le rôle dans le restaurant
  image?: string;         // Nom ou URL de la photo de profil
}

// Format exact de la réponse envoyée par Express lors de la connexion
export interface ReponseConnexion {
  utilisateur: Utilisateur; // Les informations sur la personne connectée
  accessToken: string;      // Le jeton de sécurité pour les requêtes
  refreshToken: string;     // Le jeton de renouvellement
}
