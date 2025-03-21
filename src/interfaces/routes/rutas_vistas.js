import { Router } from "express";
import HomeController from "../../infrastructure/services/HomeController.js";
import LoginViewsControllers from "../../infrastructure/services/LoginViewsController.js";
import { ChatController } from "../../infrastructure/controllers/chat.controller.js";
import AuthControllers from "../../infrastructure/services/AuthController.js";

const router = Router();

// Definir la ruta HOME
router.get("/", HomeController.index);

// Rutas del chatbot
router.post("/chatbot", ChatController.handleMessage);

// Rutas LOGIN
router.get("/login", LoginViewsControllers.loginpage);
router.get("/registro_usuario", LoginViewsControllers.registropage);

// Rutas de autenticación
router.post("/auth/register", AuthControllers.register);
router.post("/auth/login", AuthControllers.login);

export default router;