import facturemodel from "../model/facture.model.js";
import { paginate } from "../../commun/utils/pagination.util.js";

class facturerepository {
    static creation = async(data) => {
        return await facturemodel.create(data);
    }

    static getById = async(id) => {
        return await facturemodel.findById(id)
            .populate("id_user", "nom prenom email role")
            .populate("id_client", "nom prenom telephone email")
            .populate({
                path: "id_commande",
                populate: [
                    { path: "plat.id_plat", select: "nom prix description" },
                    { path: "id_user", select: "nom prenom role" }
                ]
            })
            .lean();
    }

    static getAll = async({ page = 1, limit = 10, skip = 0 } = {}, filtres = {}) => {
        const query = {};
        if (filtres.id_client) query.id_client = filtres.id_client;

        const dataQuery = facturemodel.find(query)
            .populate("id_user", "nom prenom email role")
            .populate("id_client", "nom prenom telephone email")
            .populate({
                path: "id_commande",
                populate: [
                    { path: "plat.id_plat", select: "nom prix description" },
                    { path: "id_user", select: "nom prenom role" }
                ]
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const countQuery = facturemodel.countDocuments(query);
        return await paginate(dataQuery, countQuery, { page, limit });
    }

    static update = async(id, data) => {
        return await facturemodel.findByIdAndUpdate(id, data);
    }

    static delete = async(id) => {
        return await facturemodel.findByIdAndDelete(id);
    }
}

export default facturerepository;