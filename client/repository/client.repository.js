import clientmodel from "../model/client.model.js";

class clientrepository {
    // creation d'un client
    static creation = async(data)=>{
        return  await clientmodel.create(data)
    }
    // recuperation d'un client par id
    static getById = async(id)=>{
        return  await clientmodel.findById(id)
    }
    // recuperation de tout les client
    static getAll = async()=>{
        return await clientmodel.find()
    }
    // mise a jour
    static update = async(id, data)=>{
        return await clientmodel.findByIdAndUpdate(id,data)
    }
    // suppresion
    static delete = async(id)=>{
        return await clientmodel.findByIdAndDelete(id)
    }
}
export default clientrepository;