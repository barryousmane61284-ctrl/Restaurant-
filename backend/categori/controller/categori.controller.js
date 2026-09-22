import categoriservice from "../service/categori.service.js";
import { getPaginationParams } from "../../commun/utils/pagination.util.js";

class categoricontroller {
    static creation = async(req, res) => {
        try {
            res.status(201).json(await categoriservice.creation(req.body));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static getById = async(req, res) => {
        try {
            res.status(200).json(await categoriservice.getById(req.params.id));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static getAll = async(req, res) => {
        try {
            const pagination = getPaginationParams(req.query);
            res.status(200).json(await categoriservice.getAll(pagination));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static update = async(req, res) => {
        try {
            res.status(200).json(await categoriservice.update(req.params.id, req.body));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static delete = async(req, res) => {
        try {
            res.status(200).json(await categoriservice.delete(req.params.id));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }
}

export default categoricontroller;