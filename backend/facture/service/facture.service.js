import facturerepository from "../repository/facture.repository.js";

class factureservice {
    static creation = async(data) => {
        return await facturerepository.creation(data);
    }

    static getById = async(id) => {
        return await facturerepository.getById(id);
    }

    static getAll = async(pagination, filtres) => {
        return await facturerepository.getAll(pagination, filtres);
    }

    static update = async(id, data) => {
        return await facturerepository.update(id, data);
    }

    static delete = async(id) => {
        return await facturerepository.delete(id);
    }
}

export default factureservice;