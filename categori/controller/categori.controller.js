import categoriservice from "../service/categori.service.js";

class categoricontroller {
    static creation = async(req, res) => {
        try {
            res.status(201).json(await categoriservice.creation(req.body));
        } catch (error) {
            res.json(error);
        }
    }

    static getById = async(req, res) => {
        try {
            res.status(200).json(await categoriservice.getById(req.params.id));
        } catch (error) {
            res.json(error);
        }
    }

    static getAll = async(req, res) => {
        try {
            res.status(200).json(await categoriservice.getAll());
        } catch (error) {
            res.json(error);
        }
    }

    static update = async(req, res) => {
        try {
            res.status(200).json(await categoriservice.update(req.params.id, req.body));
        } catch (error) {
            res.json(error);
        }
    }

    static delete = async(req, res) => {
        try {
            res.status(200).json(await categoriservice.delete(req.params.id));
        } catch (error) {
            res.json(error);
        }
    }
}

export default categoricontroller;