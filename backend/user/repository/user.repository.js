import usermodel from "../model/user.model.js";
import { Types } from "mongoose";
import { paginate } from "../../commun/utils/pagination.util.js";

class userrepository {
    static creation = async(data) => {
        return await usermodel.create(data);
    }

    static getById = async(id) => {
        if (!Types.ObjectId.isValid(id)) {
            const error = new Error("ID utilisateur invalide");
            error.status = 400;
            throw error;
        }
        return await usermodel.findById(id).lean();
    }

    static getByIdWithPassword = async(id) => {
        if (!Types.ObjectId.isValid(id)) {
            const error = new Error("ID utilisateur invalide");
            error.status = 400;
            throw error;
        }
        return await usermodel.findById(id).select("+password");
    }

    static findByEmail = async(email) => {
        return await usermodel.findOne({ email }).select("+password");
    }

    static getAll = async({ page = 1, limit = 10, skip = 0 } = {}) => {
        const dataQuery = usermodel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
        const countQuery = usermodel.countDocuments();
        return await paginate(dataQuery, countQuery, { page, limit });
    }

    static update = async(id, data) => {
        return await usermodel.findByIdAndUpdate(id, data, { new: true });
    }

    static delete = async(id) => {
        return await usermodel.findByIdAndDelete(id);
    }
}

export default userrepository;