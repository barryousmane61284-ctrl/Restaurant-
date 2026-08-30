import platservice from '../service/plat.service.js';

class platcontroller {
    static creation = async (req, res) => {
       
        try {
            res.status(201).json(await platservice.creation(req.body));
        } catch (error) {
            res.json(error)
        }
    }
    static getAll = async (req, res) => {
        try {
            res.status(200).json(await platservice.getAll());
        } catch (error) {
            res.json(error)
        }
    }
    static getById = async (req, res) => {
        try {
            res.status(200).json(await platservice.getById(req.params.id));
        } catch (error) {
            res.json(error)
        }
    }
    static update = async (req, res) => {
        try {
            res.status(200).json(await platservice.update(req.params.id, req.body));
        } catch (error) {
            res.json(error)
        }
    }
    static delete = async (req, res) => {
        try {
            res.status(200).json(await platservice.delete(req.params.id));
        } catch (error) {
            res.json(error)
        }
    }
}
export default platcontroller;