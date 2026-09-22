import { Schema, model } from "mongoose";

const lignecommandeschema = new Schema({
    id_plat: {
        type: Schema.Types.ObjectId,
        ref: "plat",
        required: true
    },
    quantite: {
        type: Number,
        required: true
    },
    prixunitaire: {
        type: Number,
        required: true,
    }
    
 }, {_id: false}
);

const commandeschema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    id_client: {
        type: Schema.Types.ObjectId,
        ref: "client",
        required: true
    },
    plat: {
        type: [lignecommandeschema]
    },

    date_commande: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        required: true,
        min: 1
    },   
    status: {
        type: String,
        enum: ["en_cours", "terminée", "annulée", "en_attente"],
        default: "en_attente"
    }
},
{ timestamps: true }
);

const commandemodel = model ("commande", commandeschema)
export default commandemodel;