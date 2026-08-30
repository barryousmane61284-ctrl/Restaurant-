import commandemodel from "../model/commande.model.js";

class commanderepository{
    static creation = async(data)=>{
        return await commandemodel.create(data)
    }
    static getById = async(id)=>{
        return await commandemodel.findById(id)
    }
    static getAll = async()=>{
        return await commandemodel.find()
    }
    static update = async(id,data)=>{
        return await commandemodel.findByIdAndUpdate(id,data)
    }
    static delete = async(id)=>{
        return await commandemodel.findByIdAndDelete(id)
    }
};
export default commanderepository;
  
