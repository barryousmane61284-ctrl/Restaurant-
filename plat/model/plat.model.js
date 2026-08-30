import { Schema, model} from "mongoose";

const platschema = new Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true,
        min: 1
    },
   
    disponible: {
        type: Boolean,
        default: true
    },
    categori: {
        type: Schema.Types.ObjectId,
        ref: "categori",
        required: true

    }

 },
 { timestamps: true }
)
const platmodel = model("plat", platschema);
export default platmodel;