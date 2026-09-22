//middleware de verification du token d'acces
import JwtUtils from "../../commun/utils/jwt.utils.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access token est obligatoire" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = JwtUtils.verifyAccessToken(token);
    req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export default authMiddleware;
