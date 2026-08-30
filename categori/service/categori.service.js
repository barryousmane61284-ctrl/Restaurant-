import categorirepository from "../repository/categori.repository.js";

class categoriservice {
    static creation = async(data) => {
        return await categorirepository.creation(data);
    }

    static getById = async(id) => {
        return await categorirepository.getById(id);
    }

    static getAll = async() => {
        return await categorirepository.getAll();
    }

    static update = async(id, data) => {
        return await categorirepository.update(id, data);
    }

    static delete = async(id) => {
        return await categorirepository.delete(id);
    }
}

export default categoriservice;