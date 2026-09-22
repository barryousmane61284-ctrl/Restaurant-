import clientmodel from "../model/client.model.js";
import { paginate } from "../../commun/utils/pagination.util.js";

class clientrepository {
    // creation d'un client
    static creation = async(data)=>{
        return  await clientmodel.create(data)
    }
    // recuperation d'un client par id
    static getById = async(id)=>{
        return  await clientmodel.findById(id).lean()
    }
    // recuperation de tout les client
    static getAll = async({ page = 1, limit = 10, skip = 0 } = {})=>{
        const dataQuery = clientmodel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
        const countQuery = clientmodel.countDocuments();
        return await paginate(dataQuery, countQuery, { page, limit });
    }
    // mise a jour
    static update = async(id, data)=>{
        return await clientmodel.findByIdAndUpdate(id,data)
    }
    // suppresion
    static delete = async(id)=>{
        return await clientmodel.findByIdAndDelete(id)
    }
}
export default clientrepository;