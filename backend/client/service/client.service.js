import clientrepository from "../repository/client.repository.js";

class clientservice{
    // creation
    static creation = async(data)=>{
        return await clientrepository.creation(data)
    }
    // recuperation
    static getAll = async(pagination)=>{
        return await clientrepository.getAll(pagination)
    }
    // recuperationID
    static getById = async(id)=>{
        return await clientrepository.getById(id)
    }
    //mise a jour
    static update = async(id,data)=>{
        return await clientrepository.update(id,data)
    }
    // suppression
    static delete = async(id)=>{
        return await clientrepository.delete(id)
    }

}
export default clientservice;