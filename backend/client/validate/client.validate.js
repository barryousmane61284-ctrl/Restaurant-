import yup from 'yup';

const clientschema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    prenom: yup.string().required("Le prénom est requis"),
    matricule: yup.string().optional(),
    telephone: yup.string().nullable().optional(),
    email: yup.string().nullable().optional(),
    adresse: yup.string().nullable().optional()
});
export default clientschema;

