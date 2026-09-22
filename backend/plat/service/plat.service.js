import platrepository from "../repository/plat.repository.js";

class platservice {
    // creer un plat
    static creation = async (Data) => {
        return await platrepository.creation(Data);
    }
    // recuperer tous les plats avec pagination
    static getAll = async (pagination) => {
        return await platrepository.getAll(pagination);
    }
    // recuperer un plat par son id
     static getById = async (id) => {
        return await platrepository.getById(id);
    }
    // mettre a jour un plat
    static update = async (id, Data) => {
        return await platrepository.update(id, Data);
    }
    // supprimer un plat
    static delete = async (id) => {
        return await platrepository.delete(id);
    }
}

export default  platservice;