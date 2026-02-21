import { Router } from "express";
import { signup, signin } from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../middleware/authValidation.js";
import { validate } from "../middleware/validator.js";
const authRouter = Router();

authRouter.post("/sign-up", validate(registerSchema), signup);
authRouter.post("/sign-in", validate(loginSchema), signin);

export default authRouter;
