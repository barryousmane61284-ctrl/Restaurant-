import usercontroller from "../controller/user.controller.js";
import { Router } from "express";
import { userCreationSchema, userUpdateSchema, changePasswordSchema } from "../validate/user.validate.js";
import validationMiddleware from "../../commun/validator.js";
import authMiddleware from "../../authentification/middleware/auth.middleware.js";
import roleMiddleware from "../../authentification/middleware/role.middleware.js";
import ownerMiddleware from "../../authentification/middleware/owner.middleware.js";
import { uploadUser } from "../../commun/middleware/upload.middleware.js";

const routeuser = Router();

routeuser.use(authMiddleware);

routeuser.get("/", roleMiddleware("admin"), usercontroller.getAll);
// uploadUser se place AVANT la validation Yup (sinon req.file n'existe pas encore)
routeuser.post("/", roleMiddleware("admin"), uploadUser, validationMiddleware(userCreationSchema), usercontroller.creation);
routeuser.get("/:id", ownerMiddleware, usercontroller.getById);
routeuser.put("/:id", ownerMiddleware, uploadUser, validationMiddleware(userUpdateSchema), usercontroller.update);
routeuser.put("/:id/update-password", ownerMiddleware, validationMiddleware(changePasswordSchema), usercontroller.updatePassword);
routeuser.delete("/:id", roleMiddleware("admin"), usercontroller.delete);

export default routeuser;