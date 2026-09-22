import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────────────────────
// Fonction générique : crée un middleware d'upload pour un
// sous-dossier donné (ex: 'plats' → uploads/plats/)
// ─────────────────────────────────────────────────────────────
const creerUploadMiddleware = (sousDossier) => {

    // On crée le dossier cible s'il n'existe pas encore
    const uploadDir = path.join('uploads', sousDossier);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 1. Où enregistrer le fichier et sous quel nom
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        // Nom unique : timestamp + nombre aléatoire + extension originale
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    // 2. Filtre de sécurité : images uniquement (mimetype + extension)
    const fileFilter = (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
            cb(null, true); // Fichier accepté
        } else {
            cb(new Error("Type de fichier non autorisé. Seules les images (jpeg, png, webp) sont acceptées !"), false);
        }
    };

    // 3. Création du middleware multer avec nos configurations
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 2 * 1024 * 1024 // 2 Mo maximum
        }
    });

    // 4. On retourne le middleware Express prêt à l'emploi
    return (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: "Erreur d'upload: " + err.message });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    };
};

// ─────────────────────────────────────────────────────────────
// Les deux middlewares prêts à l'emploi
// ─────────────────────────────────────────────────────────────
export const uploadPlat = creerUploadMiddleware('plats');
export const uploadUser = creerUploadMiddleware('users');

// ─────────────────────────────────────────────────────────────
// Utilitaire : supprime un fichier sur le disque sans faire
// planter l'application si le fichier n'existe pas
// ─────────────────────────────────────────────────────────────
export const deleteFile = async (filePath) => {
    if (!filePath) return;
    try {
        await fs.promises.unlink(filePath);
    } catch (err) {
        // On log l'erreur mais on ne bloque pas l'application
        console.error(`Erreur lors de la suppression du fichier (${filePath}):`, err.message);
    }
};
