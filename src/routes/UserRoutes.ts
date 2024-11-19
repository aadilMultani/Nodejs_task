// src/routes/UserRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users", authMiddleware, UserController.listUsers);
router.get("/users/:id", authMiddleware, UserController.userDetails);
router.get("/search", authMiddleware, UserController.searchUsers); 
router.get("/filter", authMiddleware, UserController.filterUsersByCountry);

export default router;