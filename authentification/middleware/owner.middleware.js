const ownerMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Utilisateur non authentifié"
        });
    }

    const estAdministrateur = req.user.role === "admin";
    const estProprietaire = req.user.id === req.params.id;

    if (!estAdministrateur && !estProprietaire) {
        return res.status(403).json({
            message: "Vous ne pouvez pas accéder à cette ressource"
        });
    }

    next();
};

export default ownerMiddleware;