import clientservice from "../service/client.service.js";
import { getPaginationParams } from "../../commun/utils/pagination.util.js";

class clientcontroller{
    // creation
    static creation = async(req,res)=>{
        try{
            res.status(201).json(await clientservice.creation(req.body))
        }
        catch (error){
            res.status(500).json({ message: error.message || error });
        }
    }
    // recuperation
    static getAll = async(req,res)=>{
        try{
            const pagination = getPaginationParams(req.query);
            res.status(200).json(await clientservice.getAll(pagination))
        }
        catch(error){
            res.status(500).json({ message: error.message || error });
        }
    }
    // recuperationID
    static getById = async(req,res)=>{
        try{
            res.status(200).json(await clientservice.getById(req.params.id))
        }
        catch(error){
            res.status(500).json({ message: error.message || error });
        }
    }
    // mise a jour
    static update = async(req,res)=>{
        try{
            res.status(200).json(await clientservice.update(req.params.id,req.body))
        }
        catch(error){
            res.status(500).json({ message: error.message || error });
        }
    }
    // suppression
    static delete = async(req,res)=>{
        try{
            res.status(200).json(await clientservice.delete(req.params.id))
        }
        catch(error){
            res.status(500).json({ message: error.message || error });
        }
        
    }
    
}
export default clientcontroller;