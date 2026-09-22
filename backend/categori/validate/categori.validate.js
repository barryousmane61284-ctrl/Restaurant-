import yup from "yup";

const categorieschema = yup.object().shape({
    nom: yup.string().required("Le nom de la catégorie est requis"),
    description: yup.string().required("La description de la catégorie est requise")
});

export default categorieschema;