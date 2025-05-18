import { Router } from "express";
import HomeController from "../../infrastructure/services/HomeController.js";
import LoginViewsControllers from "../../infrastructure/services/LoginViewsController.js";
import { ChatController } from "../../infrastructure/controllers/chat.controller.js";
import AuthControllers from "../../infrastructure/services/AuthController.js";

import ViewsTable from "../../infrastructure/services/TablasController.js";


import { verifyToken } from "../../shared/middleware/Verificar_Token.js";
import PdfController from "../../infrastructure/services/PdfControllers.js"
import jwt from "jsonwebtoken";
import Perfil from "../../infrastructure/services/PerfilController.js";
const router = Router();


router.get("/",HomeController.index_neutro);

// Definir la ruta HOME
router.get("/Finanzas_Raiz", verifyToken, HomeController.index);

// Rutas del chatbot
router.post("/chatbot", verifyToken, ChatController.handleMessage);

// Rutas LOGIN
router.get("/login", LoginViewsControllers.loginpage);
router.get("/registro_usuario", LoginViewsControllers.registropage);

router.get("/registro_usuario/ADMINISTRADOR2025", LoginViewsControllers.registropageADMIN);



// Rutas de autenticación
router.post("/registro_usuario", AuthControllers.register);
router.post("/login", AuthControllers.login);
router.get("/logout", AuthControllers.logout);

router.get("/pdf",PdfController.crear_contrato);
router.post("/pdf",PdfController.Firma_contrato);

router.get("/tablas", ViewsTable.verTablas);

router.get("/perfil", verifyToken, Perfil.perfil);

export default router;