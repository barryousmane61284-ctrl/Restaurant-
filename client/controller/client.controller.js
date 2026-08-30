import clientservice from "../service/client.service.js";

class clientcontroller{
    // creation
    static creation = async(req,res)=>{
        try{
            res.status(201).json(await clientservice.creation(req.body))
        }
        catch (error){
            res.json(error)

        }
    }
    // reuperation
    static getAll = async(req,res)=>{
        try{
            res.status(200).json(await clientservice.getAll())
        }
        catch(error){
            res.json(error)
        }
    }
    // recuperationID
    static getById = async(req,res)=>{
        try{
            res.status(200).json(await clientservice.getById(req.params.id))
        }
        catch(error){
            res.json(error)
        }
    }
    // mise a jour
    static update = async(req,res)=>{
        try{
            res.status(200).json(await clientservice.update(req.params.id,req.body))
        }
        catch(error){
            res.json(error)
        }
    }
    // suppression
    static delete = async(req,res)=>{
        try{
            res.status(200).json(await clientservice.delete(req.params.id))
        }
        catch(error){
            res.json(error)         
        }
        
    }
    
}
export default clientcontroller;