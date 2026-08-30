import factureservice from "../service/facture.service.js";

class facturecontroller {
    static creation = async(req, res) => {
        try {
            res.status(201).json(await factureservice.creation(req.body));
        } catch (error) {
            res.json(error);
        }
    }

    static getById = async(req, res) => {
        try {
            res.status(200).json(await factureservice.getById(req.params.id));
        } catch (error) {
            res.json(error);
        }
    }

    static getAll = async(req, res) => {
        try {
            res.status(200).json(await factureservice.toutfacture());
        } catch (error) {
            res.json(error);
        }
    }

    static update = async(req, res) => {
        try {
            res.status(200).json(await factureservice.update(req.params.id, req.body));
        } catch (error) {
            res.json(error);
        }
    }

    static delete = async(req, res) => {
        try {
            res.status(200).json(await factureservice.delete(req.params.id));
        } catch (error) {
            res.json(error);
        }
    }
}

export default facturecontroller;