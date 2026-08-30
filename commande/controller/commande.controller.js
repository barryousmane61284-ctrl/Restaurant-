import commandeservice from "../service/commande.service.js";

class commandecontroller{
    static creation = async(req,res)=>{
        try{
            res.status(201).json(await commandeservice.creation(req.body))
        }
        catch(error){
            res.json(error)          
        }
    }
     static getById = async(req,res)=>{
        try{
            res.status(200).json(await commandeservice.getById(req.params.id))
        }
        catch(error){
            res.json(error)          
        }
    }
     static getAll = async(req,res)=>{
        try{
            res.status(200).json(await commandeservice.getAll())
        }
        catch(error){
            res.json(error)          
        }
    }
     static update = async(req,res)=>{
        try{
            res.status(200).json(await commandeservice.update(req.params.id,req.body))
        }
        catch(error){
            res.json(error)          
        }
    }
     static delete = async(req,res)=>{
        try{
            res.status(200).json(await commandeservice.delete(req.params.id))
        }
        catch(error){
            res.json(error)        
        }
    }

}
export default commandecontroller;
