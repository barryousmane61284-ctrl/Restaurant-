import rateLimit from 'express-rate-limit';

// Limiteur pour les tentatives de connexion (anti-brute-force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 tentatives de connexion par IP toutes les 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    // req.rateLimit.resetTime est l'instant exact de réinitialisation calculé par express-rate-limit
    const maintenant = Date.now();
    const resetTimestamp = req.rateLimit?.resetTime
      ? new Date(req.rateLimit.resetTime).getTime()
      : (maintenant + 15 * 60 * 1000);

    const tempsRestantMs = Math.max(0, resetTimestamp - maintenant);
    const secondesRestantes = Math.ceil(tempsRestantMs / 1000);
    const minutesRestantes = Math.ceil(secondesRestantes / 60);

    res.status(options.statusCode || 429).json({
      message: `Trop de tentatives de connexion échouées. Veuillez réessayer dans ${minutesRestantes} minute(s).`,
      secondesRestantes: secondesRestantes,
      resetTime: resetTimestamp,
      bloque: true
    });
  }
});

// Limiteur global plus souple pour les autres requêtes API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer plus tard."
  },
  standardHeaders: true,
  legacyHeaders: false
});
