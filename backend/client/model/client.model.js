import { Schema, model } from "mongoose";
import { string } from "yup";

const clientschema = new Schema({
    matricule: {
        type:String,
        require:true,
    },
    nom: {
      type: String,
     required: true
    },
    prenom: {
      type: String,
     required: true
    },
    telephone: {
        type: String,
        trim: true
    },
    adresse: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
   
 },
 { timestamps: true}
)
const clientmodel = model("client", clientschema)
export default clientmodel