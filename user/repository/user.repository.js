import usermodel from "../model/user.model.js";
import { Types } from "mongoose";

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
        return await usermodel.findById(id);
    }

    static findByEmail = async(email) => {
        return await usermodel.findOne({ email }).select("+password");
    }

    static getAll = async() => {
        return await usermodel.find();
    }

    static update = async(id, data) => {
        return await usermodel.findByIdAndUpdate(id, data);
    }

    static delete = async(id) => {
        return await usermodel.findByIdAndDelete(id);
    }
}

export default userrepository;