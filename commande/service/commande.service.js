import commanderepository from "../repository/commande.repository.js";

class commandeservice{
    static creation = async(data)=>{
        return await commanderepository.creation(data)
    }
    static getById = async(id)=>{
        return await commanderepository.getById(id)
    }
    static getAll = async()=>{
        return await commanderepository.getAll()
    }
    static update = async(id,data)=>{
        return await commanderepository.update(id,data)
    }
    static delete = async(id)=>{
        return await commanderepository.delete(id)
    }
}
export default commandeservice;