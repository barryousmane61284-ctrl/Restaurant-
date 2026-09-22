import { Router } from "express";
import authcontroller from "../controller/auth.controller.js";
import { connexionSchema, inscriptionSchema } from "../validate/auth.validate.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validationMiddleware from "../../commun/validator.js";

const routeauth = Router();

routeauth.post("/inscription", validationMiddleware(inscriptionSchema), authcontroller.inscription);
routeauth.post("/connexion", validationMiddleware(connexionSchema), authcontroller.connexion);
routeauth.get("/moi", authMiddleware, authcontroller.utilisateurConnecte);

export default routeauth;