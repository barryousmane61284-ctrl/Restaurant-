import facturecontroller from "../controller/facture.controller.js";
import { Router } from "express";
import factureschema from "../validate/facture.validate.js";
import validationMiddleware from "../../commun/validator.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";

const routefacture = Router();

routefacture.use(authMiddleware);

routefacture.get("/", roleMiddleware("admin", "caissier", "serveur"), facturecontroller.getAll);
routefacture.post("/creation", roleMiddleware("admin", "caissier"), validationMiddleware(factureschema), facturecontroller.creation);
routefacture.get("/:id", roleMiddleware("admin", "caissier", "serveur"), facturecontroller.getById);
routefacture.put("/:id", roleMiddleware("admin", "caissier"), validationMiddleware(factureschema), facturecontroller.update);
routefacture.delete("/:id", roleMiddleware("admin"), facturecontroller.delete);

export default routefacture;