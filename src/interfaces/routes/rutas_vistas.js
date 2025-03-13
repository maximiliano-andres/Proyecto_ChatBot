import { Router } from 'express';
import HomeController from "../../infrastructure/services/main.js";

const router = Router();

// Definir la ruta principal
router.get('/', HomeController.index);

export default router;