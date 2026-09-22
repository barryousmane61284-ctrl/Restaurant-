import yup from 'yup';

const platschema = yup.object().shape({
    nom: yup.string().required("Le nom du plat est requis"),
    description: yup.string().required("La description du plat est requise"),
    prix: yup.number().required("Le prix du plat est requis").positive("Le prix doit être un nombre positif"),
    disponible: yup.boolean().required("La disponibilité du plat est requise"),
    categori: yup.string().required("La catégorie du plat est requise")
});

export default platschema;