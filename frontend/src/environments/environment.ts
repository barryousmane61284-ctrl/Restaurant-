
// ============================================================================
// FICHIER DE CONFIGURATION DE L'ENVIRONNEMENT (URLS ET VARIABLES GLOBALES)
// ============================================================================
// À QUOI SERT CE FICHIER ?
// Il permet de centraliser l'adresse de votre backend Express.
// Comme ça, si l'adresse de votre serveur change, vous ne modifiez qu'une seule ligne ici,
// et tout le reste de l'application continuera de fonctionner automatiquement !

export const environment = {
  // Indique si le projet est en mode production (vrai site en ligne) ou en développement (sur votre machine)
  production: false,

  // L'adresse de votre API Express Backend (en écoute sur le port 8000)
  apiUrl: 'http://localhost:8000'
};
