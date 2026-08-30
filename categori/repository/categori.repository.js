import categorimodel from "../model/categori.model.js";

class categorirepository {
    static creation = async(data) => {
        return await categorimodel.create(data);
    }

    static getById = async(id) => {
        return await categorimodel.findById(id);
    }

    static getAll = async() => {
        return await categorimodel.find();
    }

    static update = async(id, data) => {
        return await categorimodel.findByIdAndUpdate(id, data);
    }

    static delete = async(id) => {
        return await categorimodel.findByIdAndDelete(id);
    }
}

export default categorirepository;