import yup from 'yup';

const commandeschema = yup.object().shape({

    id_user: yup
        .string()
        .required("L'id de l'utilisateur est requis"),

    id_client: yup
        .string()
        .required("L'id du client est requis"),

    plat: yup
        .array()
        .of(
            yup.object().shape({

                id_plat: yup
                    .string()
                    .required("L'id du plat est requis"),

                quantite: yup
                    .number()
                    .positive("La quantité doit être positive")
                    .required("La quantité est requise")
                    .min(1, "La quantité doit être supérieure à 0"),

                prixunitaire: yup
                    .number()
                    .positive("Le prix doit être positif")
                    .required("Le prix unitaire est requis")
                    .min(1, "Le prix unitaire doit être supérieur à 0")
            })
        )
        .required("Les plats sont requis"),

    total: yup
        .number()
        .positive("Le total doit être positif")
        .required("Le total est requis")
        .min(1, "Le total doit être supérieur à 0")

});

export default commandeschema;

