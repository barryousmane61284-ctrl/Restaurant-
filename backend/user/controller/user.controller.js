import userservice from "../service/user.service.js";
import { deleteFile } from "../../commun/middleware/upload.middleware.js";
import { getPaginationParams } from "../../commun/utils/pagination.util.js";
import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────────────────────
// Supprime l'image d'un utilisateur depuis le disque
// Cherche d'abord dans uploads/users/ puis dans uploads/ (legacy)
// ─────────────────────────────────────────────────────────────
const supprimerImageUser = async (nomImage) => {
    if (!nomImage) return;
    const nomFichier = path.basename(nomImage);
    const cheminUsers = path.join('uploads', 'users', nomFichier);
    const cheminRacine = path.join('uploads', nomFichier);

    if (fs.existsSync(cheminUsers)) {
        await deleteFile(cheminUsers);
    } else if (fs.existsSync(cheminRacine)) {
        await deleteFile(cheminRacine);
    }
};

// ─────────────────────────────────────────────────────────────
// Gestion des erreurs :
// Si une image a été uploadée mais que la requête échoue,
// on supprime ce fichier pour ne pas laisser d'orphelins
// ─────────────────────────────────────────────────────────────
const envoyerErreur = async (res, error, fichierUploade) => {
    if (fichierUploade) {
        await deleteFile(fichierUploade.path);
    }
    res.status(error.status || 500).json({
        message: error.message || "Une erreur interne est survenue"
    });
};

class usercontroller {

    // Créer un utilisateur
    static creation = async (req, res) => {
        try {
            const { role, ...donneesUtilisateur } = req.body;
            // Si une image a été envoyée, on ajoute son nom aux données
            if (req.file) {
                donneesUtilisateur.image = req.file.filename;
            }
            res.status(201).json(await userservice.creation({
                ...donneesUtilisateur,
                role
            }));
        } catch (error) {
            // En cas d'erreur, on supprime l'image qui vient d'être uploadée
            await envoyerErreur(res, error, req.file);
        }
    }

    // Récupérer un utilisateur par son ID
    static getById = async (req, res) => {
        try {
            res.status(200).json(await userservice.getById(req.params.id));
        } catch (error) {
            await envoyerErreur(res, error);
        }
    }

    // Récupérer tous les utilisateurs (avec pagination : ?page=1&limit=10)
    static getAll = async (req, res) => {
        try {
            const pagination = getPaginationParams(req.query);
            res.status(200).json(await userservice.getAll(pagination));
        } catch (error) {
            await envoyerErreur(res, error);
        }
    }

    // Mettre à jour un utilisateur
    static update = async (req, res) => {
        try {
            const { password, role, ...donneesUtilisateur } = req.body;
            if (req.file) {
                // Récupérer l'ancienne image avant de la remplacer
                const ancienUser = await userservice.getById(req.params.id);
                // Supprimer l'ancienne image du disque pour éviter les orphelins
                if (ancienUser && ancienUser.image) {
                    await supprimerImageUser(ancienUser.image);
                }
                donneesUtilisateur.image = req.file.filename;
            }
            res.status(200).json(await userservice.update(req.params.id, donneesUtilisateur));
        } catch (error) {
            // En cas d'erreur, on supprime la nouvelle image uploadée
            await envoyerErreur(res, error, req.file);
        }
    }

    // Changer le mot de passe d'un utilisateur
    static updatePassword = async (req, res) => {
        try {
            res.status(200).json(await userservice.updatePassword(req.params.id, req.body));
        } catch (error) {
            await envoyerErreur(res, error);
        }
    }

    // Supprimer un utilisateur
    static delete = async (req, res) => {
        try {
            // Récupérer l'image avant de supprimer l'utilisateur
            const user = await userservice.getById(req.params.id);
            if (user && user.image) {
                await supprimerImageUser(user.image);
            }
            res.status(200).json(await userservice.delete(req.params.id));
        } catch (error) {
            await envoyerErreur(res, error);
        }
    }

}

export default usercontroller;