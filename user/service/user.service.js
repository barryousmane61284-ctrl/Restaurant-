import bcrypt from "bcrypt";
import userrepository from "../repository/user.repository.js";

class userservice {
    static creation = async(data) => {
        const motDePasseHash = await bcrypt.hash(data.password, 10);
        return await userrepository.creation({
            ...data,
            password: motDePasseHash
        });
    }

    static getById = async(id) => {
        return await userrepository.getById(id);
    }

    static getAll = async() => {
        return await userrepository.getAll();
    }

    static update = async(id, data) => {
        return await userrepository.update(id, data);
    }

    static delete = async(id) => {
        return await userrepository.delete(id);
    }
}

export default userservice;