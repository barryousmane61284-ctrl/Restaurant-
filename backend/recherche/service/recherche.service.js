import rechercherepository from "../repository/recherche.repository.js";

class rechercheservice {
    static rechercherGlobale = async (q) => {
        if (!q || typeof q !== "string" || q.trim() === "") {
            return {
                plats: [],
                clients: [],
                commandes: [],
                factures: [],
                utilisateurs: []
            };
        }

        return await rechercherepository.rechercher(q.trim());
    };
}

export default rechercheservice;
