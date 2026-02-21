import { Router } from "express";
import { signup, signin } from "../controllers/authController.ts";
import { registerSchema, loginSchema } from "../middleware/authValidation.ts";
import { validate } from "../middleware/validator.ts";
const authRouter = Router();

authRouter.get("/sign-up", validate(registerSchema), signup);
authRouter.post("/sign-in", validate(loginSchema), signin);

export default authRouter;
