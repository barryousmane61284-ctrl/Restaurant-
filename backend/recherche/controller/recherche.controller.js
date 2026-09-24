import rechercheservice from "../service/recherche.service.js";

class recherchecontroller {
    static rechercherGlobale = async (req, res) => {
        try {
            const { q } = req.query;
            const resultats = await rechercheservice.rechercherGlobale(q);
            return res.status(200).json({
                message: "Recherche effectuée avec succès",
                data: resultats
            });
        } catch (error) {
            console.error("Erreur controller recherche :", error);
            return res.status(500).json({
                message: "Erreur lors de l'exécution de la recherche globale",
                error: error.message
            });
        }
    };
}

export default recherchecontroller;
