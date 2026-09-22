import platservice from '../service/plat.service.js';
import { deleteFile } from '../../commun/middleware/upload.middleware.js';
import { getPaginationParams } from '../../commun/utils/pagination.util.js';
import path from 'path';
import fs from 'fs';

// Helper pour supprimer l'image d'un plat (supporte uploads/plats/ et l'ancien dossier uploads/)
const supprimerImagePlat = async (nomImage) => {
    if (!nomImage) return;
    const nomFichier = path.basename(nomImage);
    const cheminPlats = path.join('uploads', 'plats', nomFichier);
    const cheminRacine = path.join('uploads', nomFichier);
    
    if (fs.existsSync(cheminPlats)) {
        await deleteFile(cheminPlats);
    } else if (fs.existsSync(cheminRacine)) {
        await deleteFile(cheminRacine);
    }
};

class platcontroller {
    static creation = async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.image = req.file.filename;
            }
            const result = await platservice.creation(data);
            res.status(201).json(result);
        } catch (error) {
            // Nettoyage en cas d'erreur de création en BDD
            if (req.file) {
                await deleteFile(req.file.path);
            }
            res.status(500).json({ message: error.message || error });
        }
    }

    static getAll = async (req, res) => {
        try {
            const pagination = getPaginationParams(req.query);
            res.status(200).json(await platservice.getAll(pagination));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static getById = async (req, res) => {
        try {
            res.status(200).json(await platservice.getById(req.params.id));
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }

    static update = async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.image = req.file.filename;
                // Si un nouveau fichier est envoyé, on supprime l'ancienne image du plat
                const ancienPlat = await platservice.getById(req.params.id);
                if (ancienPlat && ancienPlat.image) {
                    await supprimerImagePlat(ancienPlat.image);
                }
            }
            const result = await platservice.update(req.params.id, data);
            res.status(200).json(result);
        } catch (error) {
            // Nettoyage de la nouvelle image en cas d'erreur de mise à jour
            if (req.file) {
                await deleteFile(req.file.path);
            }
            res.status(500).json({ message: error.message || error });
        }
    }

    static delete = async (req, res) => {
        try {
            const plat = await platservice.getById(req.params.id);
            if (plat && plat.image) {
                await supprimerImagePlat(plat.image);
            }
            const result = await platservice.delete(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message || error });
        }
    }
}

export default platcontroller;