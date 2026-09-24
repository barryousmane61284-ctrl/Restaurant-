// ============================================================================
// GESTIONNAIRE D'ERREURS CENTRALISÉ (GLOBAL ERROR HANDLER)
// ============================================================================
// Ce middleware Express à 4 paramètres intercepte toutes les erreurs générées
// par les routes ou contrôleurs pour formater des réponses JSON propres
// et masquer les détails sensibles en production.

const errorHandler = (err, req, res, next) => {
  const status = err.status || (err.name === 'ValidationError' ? 400 : 500);

  // Journalisation en console pour le débogage
  console.error(`[Erreur ${status}] ${req.method} ${req.originalUrl || req.url}:`, err.message);

  // 1. Erreur de validation Yup
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation des données fournies.',
      erreurs: err.errors || [err.message]
    });
  }

  // 2. Erreur d'identifiant MongoDB invalide (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `Identifiant invalide fourni pour la ressource.`
    });
  }

  // 3. Erreur de duplication MongoDB (E11000 duplicate key)
  if (err.code === 11000) {
    const champ = err.keyValue ? Object.keys(err.keyValue)[0] : 'champ';
    return res.status(409).json({
      message: `La valeur pour le champ '${champ}' existe déjà.`
    });
  }

  // 4. Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Jeton de sécurité invalide.'
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Votre session a expiré. Veuillez vous reconnecter.'
    });
  }

  // 5. Réponse générique propre
  res.status(status).json({
    message: err.message || 'Une erreur interne inattendue est survenue.',
    ...(process.env.NODE_ENV === 'development' ? { details: err.stack } : {})
  });
};

export default errorHandler;
