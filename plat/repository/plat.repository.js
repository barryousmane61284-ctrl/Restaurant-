import platModel from "../model/plat.model.js";

class platrepository {
    static creation = async (Data) => {
        return await platModel.create(Data);
    }

    static getAll = async () => {
        return await platModel.find();
    }
    static getById = async (id) => {
        return await platModel.findById(id);
    }
    static update = async (id, Data) => {
        return await platModel.findByIdAndUpdate(id, Data, )
    }
    static delete = async (id) => {
        return await platModel.findByIdAndDelete(id);
    }   
}
export default platrepository;
