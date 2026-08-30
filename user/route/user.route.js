import usercontroller from "../controller/user.controller.js";
import { Router } from "express";
import userschema from "../validate/user.validate.js";
import validationMiddleware from "../../commun/validator.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";
import ownerMiddleware from "../../authentification/middleware/owner.middleware.js";

const routeuser = Router();

routeuser.use(authMiddleware);

routeuser.get("/", roleMiddleware("admin"), usercontroller.getAll);
routeuser.post("/", roleMiddleware("admin"), validationMiddleware(userschema), usercontroller.creation);
routeuser.get("/:id", ownerMiddleware, usercontroller.getById);
routeuser.put("/:id", ownerMiddleware, validationMiddleware(userschema), usercontroller.update);
routeuser.delete("/:id", roleMiddleware("admin"), usercontroller.delete);

export default routeuser;