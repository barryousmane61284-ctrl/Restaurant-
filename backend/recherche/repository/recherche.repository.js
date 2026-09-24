import mongoose from "mongoose";
import platmodel from "../../plat/model/plat.model.js";
import clientmodel from "../../client/model/client.model.js";
import commandemodel from "../../commande/model/commande.model.js";
import facturemodel from "../../facture/model/facture.model.js";
import usermodel from "../../user/model/user.model.js";

class rechercherepository {
    static rechercher = async (q) => {
        const regex = new RegExp(q, "i");
        const isValidId = mongoose.Types.ObjectId.isValid(q);

        // Conditions de recherche par regex ou par _id pour les commandes et factures
        const commandeFilter = isValidId 
            ? { $or: [{ _id: q }, { status: regex }] }
            : { status: regex };

        const factureFilter = isValidId 
            ? { $or: [{ _id: q }, { statut: regex }, { mode_paiement: regex }] }
            : { $or: [{ statut: regex }, { mode_paiement: regex }] };

        const [plats, clients, commandes, factures, utilisateurs] = await Promise.all([
            // Recherche Plats
            platmodel.find({
                $or: [{ nom: regex }, { description: regex }]
            }).populate("categori", "nom").limit(5),

            // Recherche Clients
            clientmodel.find({
                $or: [{ nom: regex }, { prenom: regex }, { telephone: regex }, { email: regex }, { matricule: regex }]
            }).limit(5),

            // Recherche Commandes
            commandemodel.find(commandeFilter)
                .populate("id_client", "nom prenom telephone")
                .populate("id_user", "nom prenom")
                .limit(5),

            // Recherche Factures
            facturemodel.find(factureFilter)
                .populate("id_client", "nom prenom")
                .populate("id_user", "nom prenom")
                .limit(5),

            // Recherche Utilisateurs
            usermodel.find({
                $or: [{ nom: regex }, { prenom: regex }, { email: regex }, { telephone: regex }, { role: regex }]
            }).select("-password").limit(5)
        ]);

        return {
            plats,
            clients,
            commandes,
            factures,
            utilisateurs
        };
    };
}

export default rechercherepository;
