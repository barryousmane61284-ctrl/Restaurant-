import platModel from "../model/plat.model.js";
import { paginate } from "../../commun/utils/pagination.util.js";

class platrepository {
    static creation = async (Data) => {
        return await platModel.create(Data);
    }

    static getAll = async ({ page = 1, limit = 10, skip = 0 } = {}) => {
        const dataQuery = platModel.find()
            .populate("categori", "nom")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const countQuery = platModel.countDocuments();
        return await paginate(dataQuery, countQuery, { page, limit });
    }
    static getById = async (id) => {
        return await platModel.findById(id).lean();
    }
    static update = async (id, Data) => {
        return await platModel.findByIdAndUpdate(id, Data, { new: true });
    }
    static delete = async (id) => {
        return await platModel.findByIdAndDelete(id);
    }   
}
export default platrepository;
