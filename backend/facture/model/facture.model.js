import { Schema, model } from "mongoose";

const factureschema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    id_commande: {
        type: Schema.Types.ObjectId,
        ref: "commande",
        required: true
    },
    id_client: {
        type: Schema.Types.ObjectId,
        ref: "client",
        required: true
    },
    montant_total: {
        type: Number,
        required: true,
        min: 1
    },
    date_facture: {
        type: Date,
        default: Date.now
    },
    statut: {
        type: String,
        required: true
    },
    mode_paiement: {
        type: String,
        required: true
    }
}, { timestamps: true });

const facturemodel = model("facture", factureschema);
export default facturemodel;