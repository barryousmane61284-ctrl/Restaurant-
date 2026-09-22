import factureservice from "../service/facture.service.js";
import { getPaginationParams } from "../../commun/utils/pagination.util.js";

class facturecontroller {
    static creation = async(req, res) => {
        try {
            res.status(201).json(await factureservice.creation(req.body));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static getById = async(req, res) => {
        try {
            res.status(200).json(await factureservice.getById(req.params.id));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static getAll = async(req, res) => {
        try {
            const pagination = getPaginationParams(req.query);
            const filtres = {};
            if (req.query.id_client) filtres.id_client = req.query.id_client;
            res.status(200).json(await factureservice.getAll(pagination, filtres));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static update = async(req, res) => {
        try {
            res.status(200).json(await factureservice.update(req.params.id, req.body));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static delete = async(req, res) => {
        try {
            res.status(200).json(await factureservice.delete(req.params.id));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }
}

export default facturecontroller;