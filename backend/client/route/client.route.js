import clientcontroller from "../controller/client.controller.js";
import { Router } from "express";
import clientschema from "../validate/client.validate.js";
import validationMiddleware from "../../commun/validator.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";

const routeclient = Router()

routeclient.use(authMiddleware)

routeclient.get("/", roleMiddleware("admin", "serveur", "caissier"), clientcontroller.getAll)
routeclient.post("/creation", roleMiddleware("admin", "serveur", "caissier"), validationMiddleware(clientschema), clientcontroller.creation)
routeclient.get("/:id", roleMiddleware("admin", "serveur", "caissier"), clientcontroller.getById)
routeclient.put("/:id", roleMiddleware("admin", "serveur"), validationMiddleware(clientschema), clientcontroller.update)
routeclient.delete("/:id", roleMiddleware("admin"), clientcontroller.delete)

export default routeclient


