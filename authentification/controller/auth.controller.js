import authservice from "../service/auth.service.js";

const envoyerErreur = (res, error) => {
    res.status(error.status || 500).json({
        message: error.message || "Une erreur interne est survenue"
    });
};

class authcontroller {
    static inscription = async(req, res) => {
        try {
            res.status(201).json(await authservice.inscription(req.body));
        } catch (error) {
            envoyerErreur(res, error);
        }
    }

    static connexion = async(req, res) => {
        try {
            res.status(200).json(await authservice.connexion(req.body));
        } catch (error) {
            envoyerErreur(res, error);
        }
    }

    static utilisateurConnecte = async(req, res) => {
        try {
            res.status(200).json(await authservice.utilisateurConnecte(req.user.id));
        } catch (error) {
            envoyerErreur(res, error);
        }
    }
}

export default authcontroller;