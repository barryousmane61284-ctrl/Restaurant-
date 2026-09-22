import categoricontroller from "../controller/categori.controller.js";
import express from "express";
import validationMiddleware from "../../commun/validator.js";
import categorieschema from "../validate/categori.validate.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";

const routecategori = express.Router();

routecategori.use(authMiddleware);

routecategori.post("/creation", roleMiddleware("admin"), validationMiddleware(categorieschema), categoricontroller.creation);
routecategori.get("/:id", roleMiddleware("admin", "serveur", "caissier"), categoricontroller.getById);
routecategori.get("/", roleMiddleware("admin", "serveur", "caissier"), categoricontroller.getAll);
routecategori.put("/:id", roleMiddleware("admin"), validationMiddleware(categorieschema), categoricontroller.update);
routecategori.delete("/:id", roleMiddleware("admin"), categoricontroller.delete);

export default routecategori;