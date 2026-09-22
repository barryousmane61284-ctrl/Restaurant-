import yup from 'yup';
import { Types } from 'mongoose';

// Helper : vérifie qu'une valeur est un ObjectId MongoDB valide
const estObjectIdValide = (valeur) => Types.ObjectId.isValid(valeur);

const commandeschema = yup.object().shape({

    id_user: yup
        .string()
        .required("L'id de l'utilisateur est requis")
        .test('id_user-valide', "L'id de l'utilisateur n'est pas un ID valide", estObjectIdValide),

    id_client: yup
        .string()
        .required("L'id du client est requis")
        .test('id_client-valide', "L'id du client n'est pas un ID valide", estObjectIdValide),

    plat: yup
        .array()
        .of(
            yup.object().shape({

                id_plat: yup
                    .string()
                    .required("L'id du plat est requis")
                    .test('id_plat-valide', "L'id du plat n'est pas un ID valide", estObjectIdValide),

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


