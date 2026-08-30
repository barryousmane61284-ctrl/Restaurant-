import { Schema, model } from "mongoose";

const userschema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telephone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "serveur", "caissier"],
        default: "serveur"
    }
}, { timestamps: true });

const usermodel = model("user", userschema);

export default usermodel;