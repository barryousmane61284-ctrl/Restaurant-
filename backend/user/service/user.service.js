import bcrypt from "bcrypt";
import userrepository from "../repository/user.repository.js";
import GetAllUsersDto from "../dto/getall.dto.js";

class userservice {
    static creation = async (data) => {
        const motDePasseHash = await bcrypt.hash(data.password, 10);
        return await userrepository.creation({
            ...data,
            password: motDePasseHash
        });
    }

    static getById = async (id) => {
        const user = await userrepository.getById(id);
        if (!user) {
            const error = new Error("Utilisateur introuvable");
            error.status = 404;
            throw error;
        }
        return new GetAllUsersDto(user._id ? user._id.toString() : user.id, user.nom, user.email, user.prenom, user.telephone, user.role, user.image);
    }

    static getAll = async (pagination) => {
        const result = await userrepository.getAll(pagination);
        return {
            data: result.data.map(user => new GetAllUsersDto(user._id ? user._id.toString() : user.id, user.nom, user.email, user.prenom, user.telephone, user.role, user.image)),
            pagination: result.pagination
        };
    }
    static update = async (id, data) => {
        return await userrepository.update(id, data);
    }

    static updatePassword = async (id, { ancienPassword, nouveauPassword }) => {
        const user = await userrepository.getByIdWithPassword(id);
        if (!user) {
            const error = new Error("Utilisateur introuvable");
            error.status = 404;
            throw error;
        }

        const estValide = await bcrypt.compare(ancienPassword, user.password);
        if (!estValide) {
            const error = new Error("L'ancien mot de passe est incorrect");
            error.status = 400;
            throw error;
        }

        const motDePasseHash = await bcrypt.hash(nouveauPassword, 10);
        await userrepository.update(id, { password: motDePasseHash });
        return { message: "Mot de passe modifié avec succès" };
    }

    static delete = async (id) => {
        return await userrepository.delete(id);
    }
}

export default userservice;