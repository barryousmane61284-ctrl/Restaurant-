import yup from "yup";

const inscriptionSchema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    prenom: yup.string().required("Le prénom est requis"),
    email: yup.string().email("L'email est invalide").required("L'email est requis"),
    telephone: yup.number().required("Le numéro de téléphone est requis"),
    password: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Le mot de passe est requis")
});

const connexionSchema = yup.object().shape({
    email: yup.string().email("L'email est invalide").required("L'email est requis"),
    password: yup.string().required("Le mot de passe est requis")
});

export { connexionSchema, inscriptionSchema };