import userservice from "../service/user.service.js";

const envoyerErreur = (res, error) => {
    res.status(error.status || 500).json({
        message: error.message || "Une erreur interne est survenue"
    });
};

class usercontroller {
    static creation = async(req, res) => {
        try {
            const { role, ...donneesUtilisateur } = req.body;
            res.status(201).json(await userservice.creation({
                ...donneesUtilisateur,
                role
            }));
        } catch (error) {
            envoyerErreur(res, error);
        }
    }

    static getById = async(req, res) => {
        try {
            res.status(200).json(await userservice.getById(req.params.id));
        } catch (error) {
            envoyerErreur(res, error);
        }
    }

    static getAll = async(req, res) => {
        try {
            res.status(200).json(await userservice.getAll());
        } catch (error) {
            envoyerErreur(res, error);
        }
    }

    static update = async(req, res) => {
        try {
            const { password, role, ...donneesUtilisateur } = req.body;
            res.status(200).json(await userservice.update(req.params.id, donneesUtilisateur));
        } catch (error) {
            envoyerErreur(res, error);
        }
    }

    static delete = async(req, res) => {
        try {
            res.status(200).json(await userservice.delete(req.params.id));
        } catch (error) {
            envoyerErreur(res, error);
        }
    }
   
}

export default usercontroller;