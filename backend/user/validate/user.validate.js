import yup from "yup";

// Schéma pour la CRÉATION (tous les champs obligatoires)
export const userCreationSchema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    prenom: yup.string().required("Le prénom est requis"),
    email: yup.string().email("L'email est invalide").required("L'email est requis"),
    telephone: yup.string().required("Le numéro de téléphone est requis"),
    password: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Le mot de passe est requis"),
    role: yup.string().oneOf(["serveur", "caissier"]).required("Le rôle est requis")
});

// Schéma pour la MISE À JOUR (tous les champs sont optionnels, password exclu)
export const userUpdateSchema = yup.object().shape({
    nom: yup.string(),
    prenom: yup.string(),
    email: yup.string().email("L'email est invalide"),
    telephone: yup.string(),
    role: yup.string().oneOf(["serveur", "caissier"])
});

// Schéma pour le CHANGEMENT DE MOT DE PASSE
export const changePasswordSchema = yup.object().shape({
    ancienPassword: yup.string().required("L'ancien mot de passe est requis"),
    nouveauPassword: yup.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères").required("Le nouveau mot de passe est requis"),
    confirmPassword: yup.string().oneOf([yup.ref('nouveauPassword'), null], "Les mots de passe de confirmation ne correspondent pas").required("La confirmation du mot de passe est requise")
});