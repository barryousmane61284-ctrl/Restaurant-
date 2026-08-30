import facturemodel from "../model/facture.model.js";

class facturerepository {
    static creation = async(data) => {
        return await facturemodel.create(data);
    }

    static getById = async(id) => {
        return await facturemodel.findById(id);
    }

    static getAll = async() => {
        return await facturemodel.find();
    }

    static update = async(id, data) => {
        return await facturemodel.findByIdAndUpdate(id, data);
    }

    static delete = async(id) => {
        return await facturemodel.findByIdAndDelete(id);
    }
}

export default facturerepository;