import { Router } from "express";
import recherchecontroller from "../controller/recherche.controller.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";

const routerecherche = Router();

routerecherche.use(authMiddleware);

routerecherche.get("/", recherchecontroller.rechercherGlobale);

export default routerecherche;
