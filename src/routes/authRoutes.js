import { Router } from "express";
import { loginUser, creteUser } from "../controllers/authController";

const router = Router;

router.post("/login", loginUser);
router.post("/sign-up", creteUser);

export default router;