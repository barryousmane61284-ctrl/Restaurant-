import yup from "yup";

const factureschema = yup.object().shape({
    id_user: yup.string().required("L'id de l'utilisateur est requis"),
    id_commande: yup.string().required("L'id de la commande est requis"),
    id_client: yup.string().required("L'id du client est requis"),
    montant_total: yup.number().positive("Le montant doit être positif").required("Le montant total est requis").min(1, "Le montant total doit être supérieur à 0"),
    date_facture: yup.date(),
    statut: yup.string().required("Le statut est requis"),
    mode_paiement: yup.string().required("Le mode de paiement est requis")
});

export default factureschema;