import { Schema, model } from "mongoose";

const categorischema = new Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true });

const categorimodel = model("categori", categorischema);
export default categorimodel;