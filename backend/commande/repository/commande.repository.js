import commandemodel from "../model/commande.model.js";
import { paginate } from "../../commun/utils/pagination.util.js";

class commanderepository{
    static creation = async(data)=>{
        return await commandemodel.create(data)
    }
    static getById = async(id)=>{
        return await commandemodel.findById(id).lean();
    }
    static getAll = async({ page = 1, limit = 10, skip = 0 } = {}, filtres = {})=>{
        const query = {};
        if (filtres.id_client) query.id_client = filtres.id_client;
        if (filtres.status) query.status = filtres.status;

        const dataQuery = commandemodel.find(query)
            .populate("id_user", "nom prenom email")
            .populate("id_client", "nom prenom telephone")
            .populate("plat.id_plat", "nom prix")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const countQuery = commandemodel.countDocuments(query);
        return await paginate(dataQuery, countQuery, { page, limit });
    }
    static update = async(id,data)=>{
        return await commandemodel.findByIdAndUpdate(id,data)
    }
    static delete = async(id)=>{
        return await commandemodel.findByIdAndDelete(id)
    }
};
export default commanderepository;
  
