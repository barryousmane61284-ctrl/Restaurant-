// ============================================================================
// SCHÉMA DE VALIDATION POUR LA MISE À JOUR D'UNE COMMANDE
// ============================================================================
// Ce schéma est utilisé UNIQUEMENT pour les requêtes PUT de mise à jour.
// Il permet de changer le statut seul (en_attente, en_cours, terminée, annulée)
// sans avoir à renvoyer tous les champs obligatoires (id_user, plats, total, etc.).

import yup from 'yup';
import { Types } from 'mongoose';

const estObjectIdValide = (valeur) => Types.ObjectId.isValid(valeur);

const commandeUpdateSchema = yup.object().shape({

    // Le statut est l'unique champ requis pour la mise à jour
    status: yup
        .string()
        .oneOf(
            ['en_attente', 'en_cours', 'terminée', 'annulée'],
            "Le statut doit être : en_attente, en_cours, terminée ou annulée"
        )
        .optional(), // Optionnel pour permettre les mises à jour partielles

    // Les champs suivants sont tous OPTIONNELS pour la mise à jour
    id_user: yup
        .string()
        .test('id_user-valide', "L'id utilisateur n'est pas valide", (v) => !v || estObjectIdValide(v))
        .optional(),

    id_client: yup
        .string()
        .test('id_client-valide', "L'id client n'est pas valide", (v) => !v || estObjectIdValide(v))
        .optional(),

    plat: yup
        .array()
        .of(
            yup.object().shape({
                id_plat: yup.string().test('id_plat-valide', "L'id du plat n'est pas valide", (v) => !v || estObjectIdValide(v)).optional(),
                quantite: yup.number().positive().min(1).optional(),
                prixunitaire: yup.number().positive().min(1).optional()
            })
        )
        .optional(),

    total: yup
        .number()
        .positive()
        .min(1)
        .optional()
});

export default commandeUpdateSchema;


