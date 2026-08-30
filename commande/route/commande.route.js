import commandecontroller from "../controller/commande.controller.js";
import { Router } from "express";
import commandeschema from "../validate/commande.validate.js";
import validationMiddleware from "../../commun/validator.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";

const routecommande = Router()

routecommande.use(authMiddleware)

routecommande.post("/creation", roleMiddleware("admin", "serveur", "caissier"), validationMiddleware(commandeschema), commandecontroller.creation)
routecommande.get("/", roleMiddleware("admin", "serveur", "caissier"), commandecontroller.getAll)
routecommande.get("/:id", roleMiddleware("admin", "serveur", "caissier"), commandecontroller.getById)
routecommande.put("/:id", roleMiddleware("admin", "serveur", "caissier"), validationMiddleware, commandecontroller.update)
routecommande.delete("/:id", roleMiddleware("admin"), commandecontroller.delete)

export default routecommande;
