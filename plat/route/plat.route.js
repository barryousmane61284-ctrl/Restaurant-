import platcontroller from "../controller/plat.controller.js";
import { Router} from "express";
import validationMiddleware from "../../commun/validator.js";
import platschema from "../validate/plat.validate.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";

const routeplat = Router();

routeplat.use(authMiddleware);

routeplat.post("/creation", roleMiddleware("admin"), validationMiddleware(platschema), platcontroller.creation);
routeplat.get("/", roleMiddleware("admin", "serveur", "caissier"), platcontroller.getAll);
routeplat.get("/:id", roleMiddleware("admin", "serveur", "caissier"), platcontroller.getById);
routeplat.put("/:id", roleMiddleware("admin"), platcontroller.update);
routeplat.delete("/:id", roleMiddleware("admin"), platcontroller.delete);

export default routeplat;
