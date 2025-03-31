import { Router } from "express";
import HomeController from "../../infrastructure/services/HomeController.js";
import LoginViewsControllers from "../../infrastructure/services/LoginViewsController.js";
import { ChatController } from "../../infrastructure/controllers/chat.controller.js";
import AuthControllers from "../../infrastructure/services/AuthController.js";

import { authenticateUser } from "../../shared/middleware/authMiddleware.js";
import { verifyToken } from "../../shared/middleware/Verificar_Token.js";
import PdfController from "../../infrastructure/services/PdfControllers.js"

const router = Router();


router.get("/",   (req, res) => { return res.render("index", { 
    token:"",
    title: 'Raíz Finanziera',
    titulo_1: "Bienvenido a Raíz Finanziera",
    subtitulo:"Seguridad, crecimiento y confianza en cada inversión.",
    titulo_NH:"Nuestra Historia",
    texto_NH1:"En Raíz Finanziera, creemos que el éxito financiero se construye sobre bases sólidas de confianza, estrategia y compromiso. Desde nuestra fundación en 2025, hemos trabajado incansablemente para ofrecer soluciones financieras innovadoras, adaptadas a las necesidades de nuestros clientes."

})});

// Definir la ruta HOME
router.get("/Finanzas_Raiz", verifyToken, HomeController.index);

// Rutas del chatbot
router.post("/chatbot", verifyToken, ChatController.handleMessage);

// Rutas LOGIN
router.get("/login", LoginViewsControllers.loginpage);
router.get("/registro_usuario", LoginViewsControllers.registropage);

// Rutas de autenticación
router.post("/registro_usuario", AuthControllers.register);
router.post("/login", AuthControllers.login);
router.get("/logout", AuthControllers.logout);

router.get("/pdf",PdfController.crear_contrato);


export default router;