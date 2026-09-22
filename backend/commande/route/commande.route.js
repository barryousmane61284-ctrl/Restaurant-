import commandecontroller from "../controller/commande.controller.js";
import { Router } from "express";
import commandeschema from "../validate/commande.validate.js";
// On importe le schéma allégé pour les mises à jour (statut seulement)
import commandeUpdateSchema from "../validate/commande.update.validate.js";
import validationMiddleware from "../../commun/validator.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";

const routecommande = Router()

routecommande.use(authMiddleware)

// Création d'une commande (schéma complet obligatoire)
routecommande.post("/creation", roleMiddleware("admin", "serveur", "caissier"), validationMiddleware(commandeschema), commandecontroller.creation)
// Récupérer toutes les commandes
routecommande.get("/", roleMiddleware("admin", "serveur", "caissier"), commandecontroller.getAll)
// Récupérer une commande par son ID
routecommande.get("/:id", roleMiddleware("admin", "serveur", "caissier"), commandecontroller.getById)
// Mise à jour (schéma allégé : on peut juste changer le statut)
routecommande.put("/:id", roleMiddleware("admin", "serveur", "caissier"), validationMiddleware(commandeUpdateSchema), commandecontroller.update)
// Supprimer une commande (admin seulement)
routecommande.delete("/:id", roleMiddleware("admin"), commandecontroller.delete)

export default routecommande;
