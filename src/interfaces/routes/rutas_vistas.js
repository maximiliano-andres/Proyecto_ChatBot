import { Router } from 'express';
import HomeController from "../../infrastructure/services/HomeController.js";
import AuthControllers from "../../infrastructure/services/AuthController.js";

const router = Router();

// Definir la ruta HOME
router.get('/', HomeController.index);


// Rutas LOGIN

router.get('/login', AuthControllers.loginpage);
router.get("/registro_usuario", AuthControllers.registropage);

export default router;