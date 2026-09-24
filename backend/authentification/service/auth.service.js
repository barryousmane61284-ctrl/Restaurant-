import bcrypt from "bcrypt";
import authrepository from "../repository/auth.repository.js";
import JwtUtils from "../../commun/utils/jwt.utils.js";

const rolesInternes = ["admin", "serveur", "caissier"];

const utilisateurPublic = (user) => ({
    id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    role: user.role,
    image: user.image
});

class authservice {
    static inscription = async(data) => {
        const email = data.email.toLowerCase().trim();
        const utilisateurExistant = await authrepository.findByEmail(email);

        if (utilisateurExistant) {
            const error = new Error("Cet email est déjà utilisé");
            error.status = 409;
            throw error;
        }

        const passwordHash = await bcrypt.hash(data.password, 12);
        const user = await authrepository.creationuser({
            ...data,
            email,
            password: passwordHash,
            
        });

        return {
            utilisateur: utilisateurPublic(user),
            accessToken: JwtUtils.generateAccessToken({
                id: user._id.toString(),
                role: user.role
            }),
            refreshToken: JwtUtils.generateRefreshToken({
                id: user._id.toString()
                // role: user.role
            })
        };
    }

    static connexion = async(data) => {
        const email = data.email.toLowerCase().trim();
        const user = await authrepository.findByEmail(email);
        const passwordValide = user && await bcrypt.compare(data.password, user.password);

        if (!passwordValide) {
            const error = new Error("Email ou mot de passe incorrect");
            error.status = 401;
            throw error;
        }

        if (!rolesInternes.includes(user.role)) {
            const error = new Error("La connexion est réservée aux membres du restaurant");
            error.status = 403;
            throw error;
        }

        return {
            utilisateur: utilisateurPublic(user),
            accessToken: JwtUtils.generateAccessToken({
                id: user._id.toString(),
                role: user.role
            }),
            refreshToken: JwtUtils.generateRefreshToken({
                id: user._id.toString(),
                role: user.role
            })
        };
    }

    static utilisateurConnecte = async(id) => {
        const user = await authrepository.recuperationId(id);

        if (!user) {
            const error = new Error("Utilisateur introuvable");
            error.status = 404;
            throw error;
        }

        return utilisateurPublic(user);
    }

    static rafraichir = async(refreshToken) => {
        if (!refreshToken) {
            const error = new Error("Token de rafraîchissement requis");
            error.status = 400;
            throw error;
        }

        try {
            const payload = JwtUtils.verifyRefreshToken(refreshToken);
            const user = await authrepository.recuperationId(payload.id);

            if (!user) {
                const error = new Error("Utilisateur introuvable");
                error.status = 404;
                throw error;
            }

            const accessToken = JwtUtils.generateAccessToken({
                id: user._id.toString(),
                role: user.role
            });

            return { accessToken };
        } catch (err) {
            const error = new Error("Token de rafraîchissement expiré ou invalide");
            error.status = 401;
            throw error;
        }
    }
}

export default authservice;