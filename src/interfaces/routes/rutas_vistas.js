import { Router } from "express";
import HomeController from "../../infrastructure/services/HomeController.js";
import LoginViewsControllers from "../../infrastructure/services/LoginViewsController.js";
import { ChatController } from "../../infrastructure/controllers/chat.controller.js";
import AuthControllers from "../../infrastructure/services/AuthController.js";

import ViewsTable from "../../infrastructure/services/TablasController.js";


import { verifyToken } from "../../shared/middleware/Verificar_Token.js";
import PdfController from "../../infrastructure/services/PdfControllers.js"
import Perfil from "../../infrastructure/services/PerfilController.js";

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Home principal (base).
 *     description: Home principal (base).
 *     tags:
 *       - Home
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
router.get("/",HomeController.index_neutro);


/**
 * @swagger
 * /Finanzas_Raiz:
 *   get:
 *     summary: Home principal (base).
 *     description: Home principal (base).
 *     tags:
 *       - Home
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
router.get("/Finanzas_Raiz", HomeController.index);

/**
 * @swagger
 * /chatbot:
 *   post:
 *     summary: Interacción con el chatbot
 *     description: Permite enviar un mensaje al chatbot y recibir una respuesta. Requiere autenticación por cookie (JWT).
 *     tags:
 *       - Chatbot
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hola, ¿cómo estás?"
 *     responses:
 *       200:
 *         description: Mensaje enviado y respuesta recibida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *                   example: "¡Hola! ¿En qué puedo ayudarte con tu tarjeta?"
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: No autorizado, token ausente o inválido
 *       500:
 *         description: Error interno del servidor
 */

router.post("/chatbot", verifyToken, ChatController.handleMessage);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Login.
 *     description: Carga la pagaina de Inicio de sesion para usuarios.
 *     tags:
 *       - Login
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/login", LoginViewsControllers.loginpage);

/**
 * @swagger
 * /registro_usuario:
 *   get:
 *     summary: Registro de usuario.
 *     description: Registro de usuario.
 *     tags:
 *       - Registro
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/registro_usuario", LoginViewsControllers.registropage);

/**
 * @swagger
 * /registro_usuario/ADMINISTRADOR2025:
 *   get:
 *     summary: Registro de usuario.
 *     description: Registro de usuario.
 *     tags:
 *       - Registro
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/registro_usuario/ADMINISTRADOR2025", LoginViewsControllers.registropageADMIN);

/** 
 * @swagger
 * /grupo:
 *   get:
 *     summary: Grupo.
 *     description: Grupo.
 *     tags:
 *       - Grupo
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/grupo",HomeController.index_grupo)


/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout.
 *     description: Logout.
 *     tags:
 *       - Logout
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/registro_usuario", AuthControllers.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a un usuario iniciar sesión con su correo y contraseña.
 *     tags:
 *       - Login
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: administrador@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: M@ximiliano1234
 *     responses:
 *       200:
 *         description: Login Realizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60f6b8938a1b2c001c8e4d21
 *                     nombre:
 *                       type: string
 *                       example: Juan Pérez
 *                     email:
 *                       type: string
 *                       example: usuario@example.com
 *                    
 * 
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
router.post("/login", AuthControllers.login);


/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout.
 *     description: Logout.
 *     tags:
 *       - Logout
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/logout", AuthControllers.logout);

/**
 * @swagger
 * /pdf:
 *   get:
 *     summary: Pdf.
 *     description: Pdf.
 *     tags:
 *       - Pdf
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/pdf",PdfController.crear_contrato);

/**
 * @swagger
 * /pdf:
 *   post:
 *     summary: Pdf.
 *     description: Pdf.
 *     tags:
 *       - Pdf
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/pdf",PdfController.Firma_contrato);

/**
 * @swagger
 * /tablas:
 *   get:
 *     summary: Tablas.
 *     description: Tablas.
 *     tags:
 *       - Tablas
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/tablas", ViewsTable.verTablas);

/** 
 * @swagger
 * /perfil:
 *   get:
 *     summary: Perfil.
 *     description: Perfil.
 *     tags:
 *       - Perfil
 *         
 *     responses:
 *       200:
 *         description: Pagina de inicio carga correctamente
 *                   
 *       404:
 *        
 *        description: No se encontró el recurso solicitado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/perfil", verifyToken, Perfil.perfil);

export default router;