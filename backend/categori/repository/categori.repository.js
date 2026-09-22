import categorimodel from "../model/categori.model.js";
import { paginate } from "../../commun/utils/pagination.util.js";

class categorirepository {
    static creation = async(data) => {
        return await categorimodel.create(data);
    }

    static getById = async(id) => {
        return await categorimodel.findById(id).lean();
    }

    static getAll = async({ page = 1, limit = 10, skip = 0 } = {}) => {
        const dataQuery = categorimodel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
        const countQuery = categorimodel.countDocuments();
        return await paginate(dataQuery, countQuery, { page, limit });
    }

    static update = async(id, data) => {
        return await categorimodel.findByIdAndUpdate(id, data);
    }

    static delete = async(id) => {
        return await categorimodel.findByIdAndDelete(id);
    }
}

export default categorirepository;