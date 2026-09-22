import yup, { Schema } from 'yup';
import { deleteFile } from './middleware/upload.middleware.js';

// validator middleware
const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            // Si la validation du body échoue mais qu'un fichier a déjà été uploadé par Multer,
            // on le supprime immédiatement du disque pour éviter les fichiers orphelins.
            if (req.file) {
                await deleteFile(req.file.path);
            }

            res.status(400).json({
                message: "Erreur de validation : " + error.errors
            });
        }
    };
};

export default validationMiddleware;

